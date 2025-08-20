import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrimsaModule } from 'src/primsa/primsa.module';

@Module({
  imports: [PrimsaModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
