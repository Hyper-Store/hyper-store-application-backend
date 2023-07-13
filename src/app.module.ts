import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RabbitmqOutboxModule } from './infra/rabbitmq-outbox/rabbitmq-outbox.module';
import { RabbitModule } from './rabbitmq';
import { EventSourcingModule } from './infra/event-sourcing/event-sourcing.module';
import { MongooseService } from './mongoose/mongoose.service';
import { MongooseModule } from './mongoose/mongoose.module';
import { SignaturesModule } from './modules/signatures/signatures.module';
import { ServicesModule } from './modules/services/services.module';
import { KeysModule } from './modules/keys/keys.module';
import { KeyRedemptionModule } from './modules/key-redemption/key-redemption.module';
import { UserSectionService } from './modules/user-section/user-section.service';
import { UserSectionModule } from './modules/user-section/user-section.module';
import { GuardModule } from './guards/guard.module';

@Module({
  imports: [
    RabbitModule,
    PrismaModule,
    AuthModule,
    RabbitmqOutboxModule,
    EventSourcingModule,
    MongooseModule,
    SignaturesModule,
    ServicesModule,
    KeysModule,
    KeyRedemptionModule,
    UserSectionModule,
    GuardModule,
  ],
  controllers: [],
  providers: [UserSectionService],
})
export class AppModule {}
