import { BaseEvent } from "src/modules/@shared";

export class AllSignaturesExpiredEvent extends BaseEvent {

    topic = "signature"

    constructor(
        readonly payload: AllSignaturesExpiredEvent.Payload
    ){
        super();
    }
}

export namespace AllSignaturesExpiredEvent {
    export type Payload = {
        userId: string
    }
}