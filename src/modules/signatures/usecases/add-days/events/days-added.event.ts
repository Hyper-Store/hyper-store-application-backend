import { BaseEvent } from "src/modules/@shared";

export class DaysAddedEvent extends BaseEvent {

    topic = "signature"

    constructor(
        readonly payload: DaysAddedEvent.Payload
    ){
        super();
    }
}

export namespace DaysAddedEvent {
    export type Payload = {
        signatureId: string
        daysAdded: number
        expirationDate: Date
    }
}