import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrganiserSignupDto {
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

  @IsString()
  @IsOptional()
  organisationName?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
