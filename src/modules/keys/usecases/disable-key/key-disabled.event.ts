import { BaseEvent } from "src/modules/@shared";

export class KeyDisabledEvent extends BaseEvent {

    topic = "key"

    constructor(
        readonly payload: KeyDisabledEvent.Payload
    ){
        super();
    }
}

export namespace KeyDisabledEvent {
    export type Payload = {
        key: string
    }
}