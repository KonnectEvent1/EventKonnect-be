import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SignupDto } from './signup.dto';

export class VendorSignupDto extends SignupDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Company name',
    required: false,
    example: 'Tresor Events',
  })
  companyName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Address',
    required: false,
    example: 'Kigali, Rwanda',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Service category',
    required: false,
    example: 'Catering',
  })
  category?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Service area',
    required: false,
    example: 'Kigali',
  })
  serviceArea?: string;
}
