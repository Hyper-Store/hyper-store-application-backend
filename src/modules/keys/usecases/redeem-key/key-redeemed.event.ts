import { BaseEvent } from "src/modules/@shared";
import { KeyEntity  } from "../../entities";

export class KeyRedeemedEvent extends BaseEvent {

    topic = "key"

    constructor(
        readonly payload: KeyRedeemedEvent.Payload
    ){
        super();
    }
}

export namespace KeyRedeemedEvent {
    export type Payload = {
        key: string
        keyRedeemerId: string
    }
}