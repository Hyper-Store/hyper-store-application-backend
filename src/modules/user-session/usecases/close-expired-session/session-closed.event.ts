import { BaseEvent } from "src/modules/@shared";

export class SessionClosedEvent extends BaseEvent {

    topic = "userSession"

    constructor(
        readonly payload: SessionClosedEvent.Payload
    ){
        super();
    }
}

export namespace SessionClosedEvent {
    export type Payload = {
        userSessionId: string
    }
}