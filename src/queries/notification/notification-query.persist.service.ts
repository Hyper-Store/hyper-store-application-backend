import { AmqpConnection, RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { BaseEvent } from "src/modules/@shared";
import { MongoIdpotenceConsumer } from "src/modules/@shared/providers";
import { RegisterNotificationQueryUsecase } from "./usecases";
import { MongoIdpotenceConsumerService } from "src/modules/@shared/services";


@Injectable()
export class NotificationQueryPersistService {

    @RabbitRPC({
        exchange: 'notification',
        routingKey: "NotificationSentEvent",
        queue: "register-notification-sent-query"
    })
    async registerNotification(msg: BaseEvent.Schema) {
        MongoIdpotenceConsumerService.consume(
            msg.id, 
            "register-notification-query", 
            async (session) =>
            new RegisterNotificationQueryUsecase(session)
            .execute({ ...msg.payload })
        )
    }
    
}