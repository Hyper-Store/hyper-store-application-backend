import { BaseEvent } from "src/modules/@shared";

export class UserUnBannedEvent extends BaseEvent {

    topic = "auth"

    constructor(
        readonly payload: UserUnBannedEvent.Payload
    ){
        super();
    }
}

export namespace UserUnBannedEvent {
    export type Payload = {
        userId: string
    }
}