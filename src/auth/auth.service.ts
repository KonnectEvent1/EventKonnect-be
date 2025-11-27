import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';
import * as bcrypt from 'bcrypt';
import { CustomResponse } from 'src/utils/response/customResponse';
import { ROLES } from 'src/utils/enums';
import { v4 as uuid } from 'uuid';
import { MailService } from 'src/email/mail.service';
import { loginDto } from 'src/utils/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailservice: MailService,
    private jwt: JwtService,
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
   * @param roleName - ROLES of the user (Vendor | Attendee | Organizer)
   * @returns CustomResponse containing created user info
   */

  async signup(
    dto: any,
    roleName: ROLES.VENDOR | ROLES.ATTENDEE | ROLES.ORGANIZER,
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
        select: {
          id: true,
          username: true,
          email: true,
          roleId: true,
          createdAt: true,
        },
      });

      return [user_role, user];
    });

    // Try to send verification email, but don't fail if email service is not configured
    try {
      if (roleName === ROLES.VENDOR) {
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
      // Log the error but continue - useful for development when email is not configured
      console.warn('⚠️  Email service not configured. User created but verification email not sent.');
      console.warn('   To verify user manually, run:');
      console.warn(`   UPDATE "User" SET "isVerified" = true WHERE email = '${dto.email}';`);
    }

    return {
      message:
        roleName === ROLES.VENDOR
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

  /**
   * Login a user's email and  Password .
   * - Verify if user exist
   * - Generate a jwt token for each  user
   * - Clears verification token
   *
   * @param {loginDto} - Verification token received from email
   * @returns CustomResponse with user token after verification
   */

  async login(dto: loginDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      include: {
        role: true,
      },
    });
    if (!user) throw new ForbiddenException('User not found');
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');
    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role?.name,
    });
    return token;
  }
}
