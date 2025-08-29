import { Module } from '@nestjs/common';
import { EventAttendeeService } from './event-attendee.service';
import { EventAttendeeController } from './event-attendee.controller';
import { PrimsaModule } from 'src/primsa/primsa.module';

@Module({
  imports: [PrimsaModule],
  providers: [EventAttendeeService],
  controllers: [EventAttendeeController],
})
export class EventAttendeeModule {}
