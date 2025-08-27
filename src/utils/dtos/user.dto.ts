import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username of the user' })
  username: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User password' })
  password: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Company name of the user' })
  companyName?: string;

  @ApiPropertyOptional({ description: 'Organisation name of the user' })
  organisationName?: string;

  @ApiPropertyOptional({ description: 'Address of the user' })
  address?: string;

  @ApiPropertyOptional({ description: 'Company website' })
  companyWebsite?: string;

  @ApiPropertyOptional({ description: 'User category' })
  category?: string;

  @ApiPropertyOptional({ description: 'Service area of the user' })
  serviceArea?: string;

  @ApiPropertyOptional({ description: 'Ticket type of the user' })
  ticketType?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Username' })
  username?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Company name' })
  companyName?: string;

  @ApiPropertyOptional({ description: 'Organisation name' })
  organisationName?: string;

  @ApiPropertyOptional({ description: 'Address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Company website' })
  companyWebsite?: string;

  @ApiPropertyOptional({ description: 'Category' })
  category?: string;

  @ApiPropertyOptional({ description: 'Service area' })
  serviceArea?: string;

  @ApiPropertyOptional({ description: 'Ticket type' })
  ticketType?: string;
}
