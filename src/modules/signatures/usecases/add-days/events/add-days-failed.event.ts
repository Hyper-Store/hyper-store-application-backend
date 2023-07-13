import { BaseEvent } from "src/modules/@shared";

export class AddDaysFailedEvent extends BaseEvent {

    topic = "signature"

    constructor(
        readonly payload: AddDaysFailedEvent.Payload
    ){
        super();
    }
}

export namespace AddDaysFailedEvent {
    export type Payload = {
        userId: string
        serviceId: string
        days: number
    }
}