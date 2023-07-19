import { BaseEvent } from "src/modules/@shared";

export class RedeemKeyProcessedEvent extends BaseEvent {

    topic = "keyRedemption"

    constructor(
        readonly payload: RedeemKeyProcessedEvent.Payload
    ){
        super();
    }
}

export namespace RedeemKeyProcessedEvent {
    export type Payload = {
        validUntil: number
        keyRedeemerId: string
        serviceId: string
        quantityForDay?: number
    }
}