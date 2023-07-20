import { BaseEvent } from "src/modules/@shared";

export class QuerySignatureUpdatedEvent extends BaseEvent {

    topic = "queues"
    persistEvent = false

    constructor(
        readonly payload: QuerySignatureUpdatedEvent.Payload
    ){
        super();
    }
}

export namespace QuerySignatureUpdatedEvent {
    export type Payload = any
}