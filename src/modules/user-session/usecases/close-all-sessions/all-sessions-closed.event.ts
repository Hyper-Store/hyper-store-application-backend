import { BaseEvent } from "src/modules/@shared";

export class AllSessionsClosedEvent extends BaseEvent {

    topic = "userSession"

    constructor(
        readonly payload: AllSessionsClosedEvent.Payload
    ){
        super();
    }
}

export namespace AllSessionsClosedEvent {
    export type Payload = {
        userId: string
    }
}