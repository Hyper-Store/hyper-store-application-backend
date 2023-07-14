import { BaseEvent } from "src/modules/@shared";

export class KeyDeletedEvent extends BaseEvent {

    topic = "key"

    constructor(
        readonly payload: KeyDeletedEvent.Payload
    ){
        super();
    }
}

export namespace KeyDeletedEvent {
    export type Payload = {
        key: string
    }
}