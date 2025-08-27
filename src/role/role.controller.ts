import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { Roles } from './role.decorator';

import { RoleGuard } from './role.guard';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from './role.service';
import { ROLES } from 'src/utils/enums';

@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Put('update-role')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.ADMIN)
  updateRole(@Body() body: { userId: string; roleId: string }) {
    return this.roleService.updateUserRole(body.userId, body.roleId);
  }
}
