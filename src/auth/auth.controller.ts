import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VendorSignupDto } from 'src/utils/dtos/vendorSignup.dto';
import { OrganiserSignupDto } from 'src/utils/dtos/organiserSignup.dto';
import { AttendeeSignupDto } from 'src/utils/dtos/attendeeSignup.dto';
import { Role } from 'src/utils/enums';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/vendor')
  vendorSignup(@Body() dto: VendorSignupDto) {
    return this.authService.signup(dto, Role.VENDOR);
  }

  @Post('signup/organiser')
  organiserSignup(@Body() dto: OrganiserSignupDto) {
    return this.authService.signup(dto, Role.ORGANIZER);
  }

  @Post('signup/attendee')
  attendeeSignup(@Body() dto: AttendeeSignupDto) {
    return this.authService.signup(dto, Role.ATTENDEE);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
