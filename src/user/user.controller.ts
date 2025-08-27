import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role';
import { RoleGuard } from 'src/role/role.guard';
import { ROLES } from 'src/utils/enums';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/utils/dtos';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /** Get my account info */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.VENDOR, ROLES.ATTENDEE, ROLES.ORGANIZER)
  @Get('me')
  @ApiOperation({ summary: 'Get the current logged-in user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyAccount(@Req() req) {
    const userId = req.user.sub;
    return this.userService.getUserById(userId);
  }

  /** Update my account info */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.VENDOR, ROLES.ATTENDEE, ROLES.ORGANIZER)
  @Put('update')
  @ApiOperation({ summary: 'Update the current logged-in user info' })
  @ApiBody({ type: UpdateUserDto, description: 'Fields to update' })
  @ApiResponse({ status: 200, description: 'User info updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateMyAccount(@Req() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.sub;
    return this.userService.updateUser(userId, dto);
  }

  /** Soft delete account */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.VENDOR, ROLES.ATTENDEE, ROLES.ORGANIZER)
  @Delete('delete')
  @ApiOperation({ summary: 'Soft delete the current logged-in user account' })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteMyAccount(@Req() req) {
    const userId = req.user.sub;
    return this.userService.deleteUser(userId);
  }
}
