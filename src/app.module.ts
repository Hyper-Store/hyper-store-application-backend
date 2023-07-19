import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RabbitmqOutboxModule } from './infra/rabbitmq-outbox/rabbitmq-outbox.module';
import { RabbitModule } from './infra/rabbitmq';
import { EventSourcingModule } from './infra/event-sourcing/event-sourcing.module';
import { SignaturesModule } from './modules/signatures/signatures.module';
import { ServicesModule } from './modules/services/services.module';
import { KeysModule } from './modules/keys/keys.module';
import { KeyRedemptionModule } from './modules/key-redemption/key-redemption.module';
import { GuardModule } from './guards/guard.module';
import { UserSessionModule } from './modules/user-session/user-session.module';
import { MongooseModule } from './infra/mongoose/mongoose.module';
import { NotificationModule } from './modules/notification/notification.module';
import { NotificationQueryModule } from './queries/notification/notification-query.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './infra/filters';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { PrismaIdpotenceConsumerService } from './modules/@shared/services';
import { StockModule } from './modules/stock/stock.module';
import { StockRedemptionModule } from './modules/stock-redemption/stock-redemption.module';
import { KeyRedemptionInfoModule } from './queries/key-redemption-info/key-redemption-info.module';

@Global()
@Module({
  imports: [
    RabbitModule,
    PrismaModule,
    AuthModule,
    RabbitmqOutboxModule,
    EventSourcingModule,
    SignaturesModule,
    ServicesModule,
    KeysModule,
    KeyRedemptionModule,
    MongooseModule,
    GuardModule,
    UserSessionModule,
    NotificationModule,
    NotificationQueryModule,
    WebsocketModule,
    StockModule,
    StockRedemptionModule,
    KeyRedemptionInfoModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    PrismaIdpotenceConsumerService
  ],
  exports: [ PrismaIdpotenceConsumerService ]
})
export class AppModule {}
