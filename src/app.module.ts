import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { PrimsaModule } from './primsa/primsa.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { EventModule } from './event/event.module';
import { EventAttendeeModule } from './event-attendee/event-attendee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UserModule,
    AuthModule,
    MailModule,
    PrimsaModule,
    EventModule,
    EventAttendeeModule,
  ],

  controllers: [],
  providers: [UserService],
})
export class AppModule {}
