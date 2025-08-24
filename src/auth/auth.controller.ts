import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VendorSignupDto } from 'src/utils/dtos/vendorSignup.dto';
import { OrganiserSignupDto } from 'src/utils/dtos/organiserSignup.dto';
import { AttendeeSignupDto } from 'src/utils/dtos/attendeeSignup.dto';
import { Role } from 'src/utils/enums';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiResponse({
  status: 400,
  description: 'Invalid credentials',
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
})
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Register a new vendor' })
  @ApiCreatedResponse({
    description: 'Succesfully created vendor ',
  })
  @Post('signup/vendor')
  vendorSignup(@Body() dto: VendorSignupDto) {
    return this.authService.signup(dto, Role.VENDOR);
  }

  @Post('signup/organiser')
  @ApiOperation({ summary: 'Register a new organizer' })
  @ApiCreatedResponse({
    description: 'Succesfully created organizer ',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  organiserSignup(@Body() dto: OrganiserSignupDto) {
    return this.authService.signup(dto, Role.ORGANIZER);
  }

  @Post('signup/attendee')
  @ApiOperation({ summary: 'Register a new attendee' })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  @ApiCreatedResponse({
    description: 'Succesfully created attendee ',
  })
  attendeeSignup(@Body() dto: AttendeeSignupDto) {
    return this.authService.signup(dto, Role.ATTENDEE);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'verify a if user is valid' })
  @ApiOkResponse({
    description: 'retrieve verified user',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  @ApiNotFoundResponse({
    description: 'user was not found',
  })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
