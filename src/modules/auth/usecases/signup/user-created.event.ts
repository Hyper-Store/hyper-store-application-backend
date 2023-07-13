import { BaseEvent } from "src/modules/@shared";

export class UserCreatedEvent extends BaseEvent {

    topic = "auth"

    constructor(
        readonly payload: UserSignupEvent.Payload
    ){
        super();
    }
}

export namespace UserSignupEvent {
    export type Payload = {
        id: string
        username: string
        email: string
        password: string
    }
}