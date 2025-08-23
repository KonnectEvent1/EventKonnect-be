import { ApiProperty } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';
import { IsOptional, IsString } from 'class-validator';

export class AttendeeSignupDto extends SignupDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Ticket type (e.g., VIP, Regular)',
    required: false,
  })
  ticketType?: string;
}
