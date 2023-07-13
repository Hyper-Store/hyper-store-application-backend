import { BaseEvent } from "src/modules/@shared";
import { ServiceEntity } from "../../entities";

export class ServiceCreatedEvent extends BaseEvent {

    topic = "services"

    constructor(
        readonly payload: ServiceCreatedEvent.Payload
    ){
        super();
    }
}

export namespace ServiceCreatedEvent {
    export type Payload = ServiceEntity.PropsJSON
}