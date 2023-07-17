import { BaseEvent } from "src/modules/@shared";
import { NotificationEntity  } from "../../entities";

export class NotificationSentEvent extends BaseEvent {

    topic = "notification"

    constructor(
        readonly payload: NotificationSentEvent.Payload
    ){
        super();
    }
}

export namespace NotificationSentEvent {
    export type Payload = NotificationEntity.PropsJSON
}