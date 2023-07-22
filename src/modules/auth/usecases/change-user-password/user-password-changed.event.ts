import { BaseEvent } from "src/modules/@shared";

export class UserPasswordChangedEvent extends BaseEvent {

    topic = "auth"

    constructor(
        readonly payload: UserPasswordChangedEvent.Payload
    ){
        super();
    }
}

export namespace UserPasswordChangedEvent {
    export type Payload = {
        userId: string
        password: string
    }
}