import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Event } from '@prisma/client';
import { PrismaService } from 'src/primsa/primsa.service';
import {
  CreateEventDto,
  UpdateEventDto,
  UpdateEventStatusDto,
} from 'src/utils/dtos';
import { EventStatus, ROLES } from 'src/utils/enums';
import { CustomResponse } from 'src/utils/response/customResponse';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(
    createEventDto: CreateEventDto,
    userId: string,
    role: string,
  ): Promise<CustomResponse<Event>> {
    if (role !== ROLES.ADMIN && role !== ROLES.ORGANIZER) {
      throw new ForbiddenException('You are not allowed to create events');
    }

    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        organizerId: userId,
        images: createEventDto.images ? createEventDto.images : [],
      },
    });

    return { message: 'Event created successfully', data: event, error: '' };
  }

  async getAllEvents(): Promise<CustomResponse<Event[]>> {
    const events = await this.prisma.event.findMany();
    return { message: 'Events fetched successfully', data: events, error: '' };
  }

  async getEventById(id: string): Promise<CustomResponse<Event>> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event)
      throw new NotFoundException({
        message: 'Event not found',
        data: null,
        error: '404',
      });

    return { message: 'Event found', data: event, error: '' };
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
    userId: string,
    role: string,
  ): Promise<CustomResponse<Event>> {
    const existing = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existing)
      throw new NotFoundException({
        message: 'Event not found',
        data: null,
        error: '404',
      });

    if (existing.organizerId !== userId && role !== ROLES.ADMIN) {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...updateEventDto,
        images: updateEventDto.images ? updateEventDto.images : undefined,
      },
    });

    return {
      message: 'Event updated successfully',
      data: updated,
      error: '',
    };
  }

  async deleteEvent(
    eventId: string,
    userId: string,
    role: string,
  ): Promise<CustomResponse<null>> {
    const existing = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existing)
      throw new NotFoundException({
        message: 'Event not found',
        data: null,
        error: '404',
      });

    if (existing.organizerId !== userId && role !== ROLES.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete this event');
    }

    await this.prisma.event.update({
      where: { id: eventId },
      data: { status: EventStatus.DELETED },
    });

    return {
      message: 'Event deleted successfully',
      data: null,
      error: '',
    };
  }

  async updateEventStatus(
    eventId: string,
    dto: UpdateEventStatusDto,
    userId: string,
    role: string,
  ): Promise<CustomResponse<Event>> {
    const existing = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existing)
      throw new NotFoundException({
        message: 'Event not found',
        data: null,
        error: '404',
      });

    if (existing.organizerId !== userId && role !== ROLES.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to update event status',
      );
    }

    if (existing.status === EventStatus.DELETED) {
      throw new ForbiddenException('Cannot update a deleted event');
    }
    if (
      existing.status === EventStatus.CANCELLED &&
      dto.status !== EventStatus.ACTIVE
    ) {
      throw new ForbiddenException('Event is already cancelled');
    }

    if (dto.status === EventStatus.POSTPONED) {
      if (!dto.newDate) {
        throw new BadRequestException(
          'New date must be provided when postponing an event',
        );
      }
    }

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        status: dto.status,
        date:
          dto.status === EventStatus.POSTPONED
            ? new Date(dto.newDate!)
            : undefined,
      },
    });

    return {
      message: `Event status updated to ${dto.status}`,
      data: updated,
      error: '',
    };
  }
}
