import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { PrimsaModule } from './primsa/primsa.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    MailModule,
    PrimsaModule,
  ],

  controllers: [],
  providers: [UserService],
})
export class AppModule {}
