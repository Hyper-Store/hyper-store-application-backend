import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RabbitmqOutboxModule } from './infra/rabbitmq-outbox/rabbitmq-outbox.module';
import { RabbitModule } from './rabbitmq';
import { EventSourcingModule } from './infra/event-sourcing/event-sourcing.module';
import { MongooseService } from './mongoose/mongoose.service';
import { MongooseModule } from './mongoose/mongoose.module';

@Module({
  imports: [
    RabbitModule,
    PrismaModule,
    AuthModule,
    RabbitmqOutboxModule,
    EventSourcingModule,
    MongooseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
