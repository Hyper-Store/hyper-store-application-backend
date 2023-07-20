import { BaseEvent } from "src/modules/@shared";

export class QuerySignatureRegisteredEvent extends BaseEvent {

    topic = "queues"
    persistEvent = false

    constructor(
        readonly payload: QuerySignatureRegisteredEvent.Payload
    ){
        super();
    }
}

export namespace QuerySignatureRegisteredEvent {
    export type Payload = any
}