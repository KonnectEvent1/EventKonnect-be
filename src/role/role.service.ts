import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async updateUserRole(userId: string, newRoleId: string) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roleId: newRoleId,
      },
    });

    return updatedUser;
  }
}
