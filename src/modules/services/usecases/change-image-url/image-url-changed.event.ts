import { BaseEvent } from "src/modules/@shared";

export class ImageUrlChangedEvent extends BaseEvent {

    topic = "services"

    constructor(
        readonly payload: ImageUrlChangedEvent.Payload
    ){
        super();
    }
}

export namespace ImageUrlChangedEvent {
    export type Payload = {
        serviceId: string
        imageUrl: string
    }
}