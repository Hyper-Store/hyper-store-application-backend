import { Module } from '@nestjs/common';
import { PrismaEventSourcingService } from './prisma-event-sourcing.service';
import { MongoEventSourcingService } from './mongo-event-sourcing.service';

@Module({
    providers: [
        PrismaEventSourcingService,
        MongoEventSourcingService
    ]
})
export class EventSourcingModule {}
