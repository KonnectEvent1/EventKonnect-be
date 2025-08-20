import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrimsaModule } from 'src/primsa/primsa.module';
import { MailModule } from 'src/email/email.module';

@Module({
  imports: [PrimsaModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
