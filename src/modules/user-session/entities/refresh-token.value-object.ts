import { BaseValueObject } from "src/modules/@shared";

export class RefreshTokenValueObject extends BaseValueObject<RefreshTokenValueObject.Props> {

    constructor(props: RefreshTokenValueObject.Props){
        super(props)
    }

    isExpired(): boolean {
        return this.props.expirationDateTime.getTime() < Date.now()
    }

    toJSON(): RefreshTokenValueObject.PropsJSON {
        return {
            refreshToken: this.props.refreshToken,
            expirationDateTime: this.props.expirationDateTime
        }
    }
}

export namespace RefreshTokenValueObject {

    export type Props = {
        refreshToken: string
        expirationDateTime: Date
    }

    export type PropsJSON = Props
}