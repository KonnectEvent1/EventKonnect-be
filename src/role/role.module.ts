import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleGuard } from './role.guard';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleGuard],
})
export class RoleModule {}
