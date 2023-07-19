import { BaseEvent } from "src/modules/@shared";
import { SignatureEntity } from "../../entities";

export class QuantityPerDayChangedEvent extends BaseEvent {

    topic = "signature"

    constructor(
        readonly payload: QuantityPerDayChangedEvent.Payload
    ){
        super();
    }
}

export namespace QuantityPerDayChangedEvent {
    export type Payload = {
        signatureId: string
        quantityPerDay: number
    }
}