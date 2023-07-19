import { BaseEvent } from "src/modules/@shared";
import { StockEntity  } from "../../entities";

export class StockCreatedEvent extends BaseEvent {

    topic = "stock"

    constructor(
        readonly payload: StockCreatedEvent.Payload
    ){
        super();
    }
}

export namespace StockCreatedEvent {
    export type Payload = StockEntity.PropsJSON
}