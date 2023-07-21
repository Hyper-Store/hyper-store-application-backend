import { BaseEvent } from "src/modules/@shared";
import { StockRedemptionEntity  } from "../../entities";

export class StockRedeemedEvent extends BaseEvent {

    topic = "stockRedemption"

    constructor(
        readonly payload: StockRedeemedEvent.Payload
    ){
        super();
    }
}

export namespace StockRedeemedEvent {
    export type Payload = StockRedemptionEntity.PropsJSON & { value: string }
}