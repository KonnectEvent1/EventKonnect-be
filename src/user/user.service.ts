import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';
import { UpdateUserDto } from 'src/utils/dtos';
import { CustomResponse } from 'src/utils/response/customResponse';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /** Get user by ID */
  async getUserById(id: string): Promise<CustomResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'Successfully retrieved user',
      data: user,
      error: '',
    };
  }

  /** Update user info */
  async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<CustomResponse<any>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      include: { role: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'Successfully retrieved user',
      data: user,
      error: '',
    };
  }

  /** Delete user  */
  async deleteUser(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
