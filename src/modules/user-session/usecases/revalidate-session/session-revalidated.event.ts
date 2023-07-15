import { BaseEvent } from "src/modules/@shared";
import { UserSessionEntity } from "../../entities";

export class SessionRevalidatedEvent extends BaseEvent {

    topic = "userSession"

    constructor(
        readonly payload: SessionRevalidatedEvent.Payload
    ){
        super();
    }
}

export namespace SessionRevalidatedEvent {
    export type Payload = UserSessionEntity.PropsJSON
}