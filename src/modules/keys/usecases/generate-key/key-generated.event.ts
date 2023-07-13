import { BaseEvent } from "src/modules/@shared";
import { KeyEntity  } from "../../entities";

export class KeyGeneratedEvent extends BaseEvent {

    topic = "key"

    constructor(
        readonly payload: KeyGeneratedEvent.Payload
    ){
        super();
    }
}

export namespace KeyGeneratedEvent {
    export type Payload = KeyEntity.PropsJSON
}