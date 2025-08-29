import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ROLES } from 'src/utils/enums';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string, role?: string) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    let subject: string;
    let body: string;

    if (role === ROLES.VENDOR) {
      const changePasswordLink = `${frontendUrl}/change-password?token=${token}`;
      subject = 'Set your password for EventKonnect Vendor Account';
      body = `
      <p>Welcome to EventKonnect Vendor Platform!</p>
      <p>Your account has been created by our team.</p>
      <p>Please set your password before logging in:</p>
      <a href="${changePasswordLink}">Set Password</a>
    `;
    } else {
      const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
      subject = 'Verify your EventKonnect account';
      body = `
      <p>Welcome to EventKonnect!</p>
      <p>Please verify your account by clicking below:</p>
      <a href="${verificationLink}">Verify Account</a>
    `;
    }

    return this.transporter.sendMail({
      from: `"EventKonnect" <${this.config.get<string>('EMAIL_USER')}>`,
      to: email,
      subject,
      html: body,
    });
  }
}
