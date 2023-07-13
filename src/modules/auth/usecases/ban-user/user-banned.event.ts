import { BaseEvent } from "src/modules/@shared";

export class UserBannedEvent extends BaseEvent {

    topic = "auth"

    constructor(
        readonly payload: UserBannedEvent.Payload
    ){
        super();
    }
}

export namespace UserBannedEvent {
    export type Payload = {
        userId: string
    }
}