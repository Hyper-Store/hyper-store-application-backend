import { BaseEvent } from "src/modules/@shared";

export class NotificationMarkedAsSeenEvent extends BaseEvent {

    topic = "notification"

    constructor(
        readonly payload: NotificationMarkedAsSeenEvent.Payload
    ){
        super();
    }
}

export namespace NotificationMarkedAsSeenEvent {
    export type Payload = {
        notificationId: string
    }
}