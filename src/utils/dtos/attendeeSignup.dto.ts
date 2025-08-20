import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AttendeeSignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
