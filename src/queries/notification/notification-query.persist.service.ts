import { AmqpConnection, RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { BaseEvent } from "src/modules/@shared";
import { MongoIdpotenceConsumer } from "src/modules/@shared/providers";
import { MarkAsSeenUsecase, RegisterNotificationQueryUsecase } from "./usecases";
import { MongoIdpotenceConsumerService } from "src/modules/@shared/services";
import { MongoNotificationQueryRepository } from "./repositories";


@Injectable()
export class NotificationQueryPersistService {

    @RabbitRPC({
        exchange: 'notification',
        routingKey: "NotificationSentEvent",
        queue: "register-notification-sent-query"
    })
    async registerNotification(msg: BaseEvent.Schema) {
        await MongoIdpotenceConsumerService.consume(
            msg.id, 
            "register-notification-query", 
            async (session) =>
            new RegisterNotificationQueryUsecase(session)
            .execute({ ...msg.payload })
        )
    }

    @RabbitRPC({
        exchange: 'notification',
        routingKey: "NotificationMarkedAsSeenEvent",
        queue: "register-notification-marked-as-seen-query"
    })
    async markAsSeen(msg: BaseEvent.Schema) {
        await MongoIdpotenceConsumerService.consume(
            msg.id, 
            "register-notification-marked-as-seen-query", 
            async (session) =>
            new MarkAsSeenUsecase(session)
            .execute({ notificationId: msg.payload.notificationId })
        )
    }
    
}