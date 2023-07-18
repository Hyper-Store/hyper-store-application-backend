import { BaseEvent } from "src/modules/@shared";
import { NotificationSeenEntity } from "../../entities";

export class NotificationMarkedAsSeenEvent extends BaseEvent {

    topic = "notification"

    constructor(
        readonly payload: NotificationMarkedAsSeenEvent.Payload
    ){
        super();
    }
}

export namespace NotificationMarkedAsSeenEvent {
    export type Payload = NotificationSeenEntity.PropsJSON
}