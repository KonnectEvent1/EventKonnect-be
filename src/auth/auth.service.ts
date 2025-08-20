// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';
import * as bcrypt from 'bcrypt';
import { CustomResponse } from 'src/utils/response/customResponse';
import { Role } from 'src/utils/enums';
import { v4 as uuid } from 'uuid';
import { MailService } from 'src/email/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailservice: MailService,
  ) {}

  /**
   * Handles user signup for different roles (Vendor, Attendee, Organizer).
   * - Checks if email already exists
   * - Hashes password
   * - Creates role if not already present
   * - Creates user with verification token
   * - Sends verification/change-password email depending on role
   *
   * @param dto - Incoming user data
   * @param roleName - Role of the user (Vendor | Attendee | Organizer)
   * @returns CustomResponse containing created user info
   */

  async signup(
    dto: any,
    roleName: Role.VENDOR | Role.ATTENDEE | Role.ORGANIZER,
  ): Promise<CustomResponse<any>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = uuid();

    const [role, user] = await this.prisma.$transaction(async (prisma) => {
      let user_role = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!user_role) {
        user_role = await prisma.role.create({ data: { name: roleName } });
      }

      const user = await prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
          phone: dto.phone,
          companyName: dto.companyName ?? dto.organisationName ?? null,
          address: dto.address ?? null,
          verificationToken,
          roleId: user_role.id,
        },
      });

      return [user_role, user];
    });

    try {
      if (roleName === Role.VENDOR) {
        await this.mailservice.sendVerificationEmail(
          dto.email,
          verificationToken,
          roleName,
        );
      } else {
        await this.mailservice.sendVerificationEmail(
          dto.email,
          verificationToken,
        );
      }
    } catch (err) {
      if (err) {
        await this.prisma.user.delete({ where: { id: user.id } });
        throw new BadRequestException('Signup failed: unable to send email');
      }
    }

    return {
      message:
        roleName === Role.VENDOR
          ? 'Vendor account created successfully. Please check your email to set your password.'
          : `${roleName} account created successfully. Please verify your email.`,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role.name,
      },
    };
  }

  /**
   * Verifies a user's email using the provided token.
   * - Looks up user by verificationToken
   * - Marks user as verified
   * - Clears verification token
   *
   * @param token - Verification token received from email
   * @returns CustomResponse with user info after verification
   */
  async verifyEmail(token: string): Promise<CustomResponse<any>> {
    if (!token) {
      throw new BadRequestException('Missing user token');
    }

    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Please provide a valid token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return {
      message: 'Successfully verified',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        isVerified: true,
      },
    };
  }
}
