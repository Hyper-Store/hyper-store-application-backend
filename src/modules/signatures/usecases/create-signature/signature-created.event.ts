import { BaseEvent } from "src/modules/@shared";
import { SignatureEntity } from "../../entities";

export class SignatureCreatedEvent extends BaseEvent {

    topic = "signature"

    constructor(
        readonly payload: SignatureCreatedEvent.Payload
    ){
        super();
    }
}

export namespace SignatureCreatedEvent {
    export type Payload = SignatureEntity.PropsJSON
}