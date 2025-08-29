import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EventService } from './event.service';
import {
  CreateEventDto,
  UpdateEventDto,
  UpdateEventStatusDto,
} from './../utils/dtos';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard, Roles } from 'src/role';
import { CustomResponse } from 'src/utils/response/customResponse';
import { Event } from '@prisma/client';
import { ROLES } from 'src/utils/enums';

@ApiTags('Events')
@Controller('events')
@ApiBearerAuth('JWT-auth')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new event' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.ADMIN, ROLES.ORGANIZER)
  create(
    @Body() dto: CreateEventDto,
    @Req() req,
  ): Promise<CustomResponse<Event>> {
    const userId = (req.user as any).sub;
    const role = (req.user as any).role;
    return this.eventService.createEvent(dto, userId, role);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all events' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.VENDOR, ROLES.ATTENDEE, ROLES.ORGANIZER, ROLES.ADMIN)
  findAll(): Promise<CustomResponse<Event[]>> {
    return this.eventService.getAllEvents();
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get event by ID' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.VENDOR, ROLES.ATTENDEE, ROLES.ORGANIZER, ROLES.ADMIN)
  findOne(@Param('eventId') id: string): Promise<CustomResponse<Event>> {
    return this.eventService.getEventById(id);
  }

  @Patch('update/:eventId')
  @ApiOperation({ summary: 'Update event by ID' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.ADMIN, ROLES.ORGANIZER)
  update(
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventDto,
    @Req() req,
  ): Promise<CustomResponse<Event>> {
    const userId = (req.user as any).sub;
    const role = (req.user as any).role;
    return this.eventService.updateEvent(eventId, dto, userId, role);
  }

  @Delete('delete/:eventId')
  @ApiOperation({ summary: 'Delete event by ID' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.ADMIN, ROLES.ORGANIZER)
  remove(
    @Param('eventId') eventId: string,
    @Req() req,
  ): Promise<CustomResponse<null>> {
    const userId = (req.user as any).sub;
    const role = (req.user as any).role;
    return this.eventService.deleteEvent(eventId, userId, role);
  }

  @Patch('status/:eventId')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(ROLES.ADMIN, ROLES.ORGANIZER)
  @ApiOperation({ summary: 'Cancel or Postpone event by ID' })
  updateStatus(
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventStatusDto,
    @Req() req,
  ): Promise<CustomResponse<Event>> {
    const userId = (req.user as any).sub;
    const role = (req.user as any).role;
    return this.eventService.updateEventStatus(eventId, dto, userId, role);
  }
}
