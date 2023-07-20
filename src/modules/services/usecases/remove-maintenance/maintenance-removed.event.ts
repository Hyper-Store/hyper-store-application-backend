import { BaseEvent } from "src/modules/@shared";
import { ServiceEntity } from "../../entities";

export class MaintananceRemovedEvent extends BaseEvent {

    topic = "services"

    constructor(
        readonly payload: MaintananceRemovedEvent.Payload
    ){
        super();
    }
}

export namespace MaintananceRemovedEvent {
    export type Payload = {
        serviceId: string
    }
}