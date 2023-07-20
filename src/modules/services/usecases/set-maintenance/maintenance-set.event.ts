import { BaseEvent } from "src/modules/@shared";
import { ServiceEntity } from "../../entities";

export class MaintananceSetEvent extends BaseEvent {

    topic = "services"

    constructor(
        readonly payload: MaintananceSetEvent.Payload
    ){
        super();
    }
}

export namespace MaintananceSetEvent {
    export type Payload = {
        serviceId: string
    }
}