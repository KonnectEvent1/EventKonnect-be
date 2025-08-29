import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SignupDto } from './signup.dto';
import { TicketType } from '../enums';
export class AttendeeSignupDto extends SignupDto {
  @IsEnum(TicketType, { message: 'Invalid ticket type' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Ticket type for the attendee',
    enum: TicketType,
    example: TicketType.VIP,
  })
  ticketType?: TicketType;
}
