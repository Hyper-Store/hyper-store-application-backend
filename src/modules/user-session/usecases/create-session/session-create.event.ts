import { BaseEvent } from "src/modules/@shared";
import { UserSessionEntity } from "../../entities";

export class SessionCreatedEvent extends BaseEvent {

    topic = "userSession"

    constructor(
        readonly payload: SessionCreatedEvent.Payload
    ){
        super();
    }
}

export namespace SessionCreatedEvent {
    export type Payload = UserSessionEntity.PropsJSON
}