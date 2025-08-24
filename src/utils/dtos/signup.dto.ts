import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of account owner',
    required: true,
    example: 'Tresor Xavier',
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of account owner',
    required: true,
    example: 'tresor@example.com',
  })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one special character',
  })
  @ApiProperty({
    description: 'Account password',
    required: true,
    example: 'Password@123',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Phone Number',
    required: false,
    example: '+250788123456',
  })
  phone?: string;
}
