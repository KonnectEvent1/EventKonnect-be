import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EventAttendeeService } from './event-attendee.service';
import { RSVPStatus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard, Roles } from 'src/role';
import { ROLES } from 'src/utils/enums';
import { ErrorResponseDto } from 'src/utils/dtos';

@ApiTags('Event Attendees')
@ApiBearerAuth('JWT-auth')
@Controller('events/:eventId/attendees')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class EventAttendeeController {
  constructor(private readonly attendeeService: EventAttendeeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.VENDOR, ROLES.ATTENDEE, ROLES.ORGANIZER, ROLES.ADMIN)
  @ApiOperation({
    summary: 'Register a user for an event',
    description: `Allowed Roles: ${ROLES.VENDOR}, ${ROLES.ATTENDEE}, ${ROLES.ORGANIZER}, ${ROLES.ADMIN}`,
  })
  @ApiParam({ name: 'eventId', type: String, description: 'Event ID' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Not allowed to register for this event',
    type: ErrorResponseDto,
  })
  register(@Param('eventId') eventId: string, @Req() req) {
    return this.attendeeService.register(eventId, req.user.sub);
  }

  @Patch(':userId/status')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.ORGANIZER, ROLES.ADMIN)
  @ApiOperation({
    summary: 'Update attendee RSVP status',
    description: `Allowed Roles: ${ROLES.ORGANIZER}, ${ROLES.ADMIN}`,
  })
  @ApiParam({ name: 'eventId', type: String, description: 'Event ID' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID of attendee',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN'] },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Attendee status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Not allowed to update attendee',
    type: ErrorResponseDto,
  })
  updateStatus(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Body('status') status: RSVPStatus,
    @Req() req,
  ) {
    return this.attendeeService.updateStatus(
      eventId,
      userId,
      status,
      req.user.role,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.ORGANIZER, ROLES.ADMIN)
  @ApiOperation({
    summary: 'Get all attendees of an event',
    description: `Allowed Roles:  ${ROLES.ORGANIZER}, ${ROLES.ADMIN}`,
  })
  @ApiParam({ name: 'eventId', type: String, description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'List of attendees returned' })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ErrorResponseDto,
  })
  getAttendees(@Param('eventId') eventId: string) {
    return this.attendeeService.getAttendees(eventId);
  }
}
