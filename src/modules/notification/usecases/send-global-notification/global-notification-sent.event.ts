import { BaseEvent } from "src/modules/@shared";
import { NotificationEntity  } from "../../entities";

export class GlobalNotificationSentEvent extends BaseEvent {

    topic = "notification"

    constructor(
        readonly payload: GlobalNotificationSentEvent.Payload
    ){
        super();
    }
}

export namespace GlobalNotificationSentEvent {
    export type Payload = NotificationEntity.PropsJSON
}