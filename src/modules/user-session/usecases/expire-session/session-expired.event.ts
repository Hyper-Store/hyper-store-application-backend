import { BaseEvent } from "src/modules/@shared";

export class SessionExpiredEvent extends BaseEvent {

    topic = "userSession"

    constructor(
        readonly payload: SessionExpiredEvent.Payload
    ){
        super();
    }
}

export namespace SessionExpiredEvent {
    export type Payload = {
        userSessionId: string
    }
}