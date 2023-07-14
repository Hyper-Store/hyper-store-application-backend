import { BaseEvent } from "src/modules/@shared";
import { ServiceEntity } from "../../entities";

export class NameChangedEvent extends BaseEvent {

    topic = "services"

    constructor(
        readonly payload: NameChangedEvent.Payload
    ){
        super();
    }
}

export namespace NameChangedEvent {
    export type Payload = {
        serviceId: string
    }
}