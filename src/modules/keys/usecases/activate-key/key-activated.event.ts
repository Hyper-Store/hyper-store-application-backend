import { BaseEvent } from "src/modules/@shared";

export class KeyActivatedEvent extends BaseEvent {

    topic = "key"

    constructor(
        readonly payload: KeyActivatedEvent.Payload
    ){
        super();
    }
}

export namespace KeyActivatedEvent {
    export type Payload = {
        key: string
    }
}