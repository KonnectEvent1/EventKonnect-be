import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  organisationName?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @IsOptional()
  @IsString()
  serviceArea?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsObject()
  pricing?: Record<string, any>;

  @IsOptional()
  @IsObject()
  portfolio?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
