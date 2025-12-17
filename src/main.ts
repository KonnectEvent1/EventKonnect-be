import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { CloudinaryConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://eventkonnect-fe-1.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  
  const ConfigDoc = new DocumentBuilder()
    .setTitle('Event Konnect API')
    .setDescription(
      'An Online Event Konnect app that Organize an event efficiently, within budget, and foster collaboration with trusted vendors.',
    )
    .setVersion('1.0.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Auth', 'Authentication endpoints - Register, Login, Password Reset')
    .addTag('User', 'User management endpoints')
    .addTag('Event', 'Event management endpoints')
    .addTag('Event Attendee', 'Event RSVP and attendance management')
    .addTag('Role', 'User role management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, ConfigDoc);
  SwaggerModule.setup('api/docs', app, document);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  const configService = app.get(ConfigService);
  CloudinaryConfig(configService);
  
  const port = process.env.PORT ?? 5000;
  await app.listen(port, '0.0.0.0');

}
bootstrap();
