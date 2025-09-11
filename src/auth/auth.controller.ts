import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { VendorSignupDto } from 'src/utils/dtos';
import { OrganiserSignupDto } from 'src/utils/dtos';
import { AttendeeSignupDto } from 'src/utils/dtos';
import { ROLES } from 'src/utils/enums';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { loginDto } from 'src/utils/dtos';

@ApiTags('Auth')
@ApiResponse({
  status: 400,
  description: 'Invalid credentials',
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
})
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Register a new vendor' })
  @ApiCreatedResponse({
    description: 'Succesfully created vendor ',
  })
  @Post('signup/vendor')
  vendorSignup(@Body() dto: VendorSignupDto) {
    return this.authService.signup(dto, ROLES.VENDOR);
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
    return this.authService.signup(dto, ROLES.ORGANIZER);
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
    return this.authService.signup(dto, ROLES.ATTENDEE);
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

  @Post('login')
  @ApiOperation({ summary: 'user login' })
  @ApiOkResponse({
    description: 'user retrieved successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  @ApiNotFoundResponse({
    description: 'user was not found',
  })
  async login(
    @Body() dto: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(dto);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 3,
    });

    return {
      message: 'Successfully Signed In',
      data: token,
      error: '',
    };
  }
}
