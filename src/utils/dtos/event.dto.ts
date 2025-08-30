import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { IsEnum } from 'class-validator';
import { EventStatus } from 'src/utils/enums';

export class CreateEventDto {
  @ApiProperty({ description: 'Event Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, description: 'Event description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Where event will take place' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'When is the event' })
  @IsDateString()
  date: string;

  @ApiProperty({ required: false, description: 'Proposed budget' })
  @IsNumber()
  budget: number;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Event Picture(s)',
  })
  @IsArray()
  @IsOptional()
  images?: string[];
}

export class UpdateEventDto extends CreateEventDto {}

export class UpdateEventStatusDto {
  @ApiProperty({
    description: 'The new status of the event',
    enum: EventStatus,
    example: EventStatus.CANCELLED,
  })
  @IsEnum(EventStatus, { message: 'Invalid event status' })
  status: EventStatus;

  @ApiPropertyOptional({
    description: 'New date of the event (required if status is POSTPONED)',
    type: String,
    format: 'date-time',
    example: '2025-09-15T14:30:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'newDate must be a valid ISO date string' })
  newDate?: string;
}
