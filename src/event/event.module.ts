import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrimsaModule } from 'src/primsa/primsa.module';

@Module({
  imports: [PrimsaModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
