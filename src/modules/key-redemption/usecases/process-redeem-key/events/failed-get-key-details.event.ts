import { BaseEvent } from "src/modules/@shared";

export class FailedGetKeyDetailsEvent extends BaseEvent {

    topic = "keyRedemption"

    constructor(
        readonly payload: FailedGetKeyDetailsEvent.Payload
    ){
        super();
    }
}

export namespace FailedGetKeyDetailsEvent {
    export type Payload = {
        key: string
    }
}