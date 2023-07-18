import { RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { BaseEvent } from "src/modules/@shared";
import { MarkAsSeenUsecase, RegisterNotificationQueryUsecase } from "./usecases";
import { MongoIdpotenceConsumerService } from "src/modules/@shared/services";


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
            "register-notification-sent-query", 
            async (session) =>
            new RegisterNotificationQueryUsecase(session)
            .execute({ ...msg.payload })
        )
    }  

    @RabbitRPC({
        exchange: 'notification',
        routingKey: "GlobalNotificationSentEvent",
        queue: "register-global-notification-query"
    })
    async registerGlobalNotification(msg: BaseEvent.Schema) {
        await MongoIdpotenceConsumerService.consume(
            msg.id, 
            "register-global-notification-query", 
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
            .execute({ ...msg.payload })
        )
    }
}

