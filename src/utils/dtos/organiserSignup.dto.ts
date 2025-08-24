import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SignupDto } from './signup.dto';

export class OrganiserSignupDto extends SignupDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Organisation name',
    required: false,
    example: 'EventKonnect Rwanda',
  })
  organisationName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Company address',
    required: false,
    example: 'Kigali, Rwanda',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Company website',
    required: false,
    example: 'https://eventkonnect.rw',
  })
  companyWebsite?: string;
}
