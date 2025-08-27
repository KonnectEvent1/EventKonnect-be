import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class loginDto {
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
}
