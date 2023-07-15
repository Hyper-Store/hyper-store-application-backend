import { BaseValueObject } from "src/modules/@shared";

export class AccessTokenValueObject extends BaseValueObject<AccessTokenValueObject.Props> {

    constructor(props: AccessTokenValueObject.Props){
        super(props)
    }

    isExpired(): boolean {
        return this.props.expirationDateTime.getTime() < Date.now()
    }

    toJSON(): AccessTokenValueObject.PropsJSON {
        return {
            accessToken: this.props.accessToken,
            expirationDateTime: this.props.expirationDateTime
        }
    }

    get accessToken(): string {
        return this.props.accessToken
    }
}

export namespace AccessTokenValueObject {

    export type Props = {
        accessToken: string
        expirationDateTime: Date
    }

    export type PropsJSON = Props
}