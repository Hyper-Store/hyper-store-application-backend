import { Module } from '@nestjs/common';
import { PrismaEventSourcingService } from './prisma-event-sourcing.service';

@Module({
    providers: [
        PrismaEventSourcingService
    ]
})
export class EventSourcingModule {}
