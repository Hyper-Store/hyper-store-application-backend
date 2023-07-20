import { BaseEvent } from "src/modules/@shared";

export class KeyRedemptionInfoProcessedEvent extends BaseEvent {

    topic = "queues"
    persistEvent = false

    constructor(
        readonly payload: KeyRedemptionInfoProcessedEvent.Payload
    ){
        super();
    }
}

export namespace KeyRedemptionInfoProcessedEvent {
    export type Payload = any
}