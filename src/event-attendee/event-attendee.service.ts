import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';
import { RSVPStatus } from '@prisma/client';
import { CustomResponse } from 'src/utils/response/customResponse';
import { EventStatus, ROLES } from 'src/utils/enums';

@Injectable()
export class EventAttendeeService {
  constructor(private readonly prisma: PrismaService) {}

  async register(
    eventId: string,
    userId: string,
  ): Promise<CustomResponse<any>> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event)
      throw new NotFoundException({
        message: 'Event not found',
        data: null,
        error: '404',
      });

    if (
      event.status === EventStatus.CANCELLED ||
      event.status === EventStatus.DELETED
    ) {
      throw new ForbiddenException(
        `Cannot register for a ${event.status.toLowerCase()} event`,
      );
    }

    const attendee = await this.prisma.eventAttendee.create({
      data: {
        eventId,
        userId,
        status: RSVPStatus.PENDING,
      },
    });

    return { message: 'Registration successful', data: attendee, error: '' };
  }

  async updateStatus(
    eventId: string,
    userId: string,
    status: RSVPStatus,
    actorRole: string,
  ): Promise<CustomResponse<any>> {
    const attendee = await this.prisma.eventAttendee.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (!attendee)
      throw new NotFoundException({
        message: 'Attendee not found',
        data: null,
        error: '404',
      });

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event)
      throw new NotFoundException({
        message: 'Event not found',
        data: null,
        error: '404',
      });

    if (
      event.status === EventStatus.CANCELLED ||
      event.status === EventStatus.DELETED
    ) {
      throw new ForbiddenException(
        `Cannot update attendee status for a ${event.status.toLowerCase()} event`,
      );
    }

    if (status === RSVPStatus.CONFIRMED || status === RSVPStatus.CANCELLED) {
      if (actorRole !== ROLES.ADMIN && actorRole !== ROLES.ORGANIZER) {
        throw new ForbiddenException('Not allowed to confirm/cancel attendees');
      }
    }

    let checkedInAt: Date | undefined = undefined;
    if (status === RSVPStatus.CHECKED_IN) {
      checkedInAt = new Date();
    }

    const updated = await this.prisma.eventAttendee.update({
      where: { eventId_userId: { eventId, userId } },
      data: { status, checkedInAt },
    });

    return {
      message: `Attendee status updated to ${status}`,
      data: updated,
      error: '',
    };
  }

  async getAttendees(eventId: string): Promise<CustomResponse<any[]>> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event)
      throw new NotFoundException({
        message: 'Event not found',
        data: null,
        error: '404',
      });

    const attendees = await this.prisma.eventAttendee.findMany({
      where: { eventId },
      include: { user: true },
    });

    return { message: 'Attendees fetched', data: attendees, error: '' };
  }
}
