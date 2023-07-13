import { BaseEvent } from "src/modules/@shared";

export class CreateSignatureFailedEvent extends BaseEvent {

    topic = "keyRedemption"

    constructor(
        readonly payload: CreateSignatureFailedEvent.Payload
    ){
        super();
    }
}

export namespace CreateSignatureFailedEvent {
    export type Payload = {
        key: string
    }
}