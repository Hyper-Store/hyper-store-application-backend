import { BaseEntity } from "src/modules/@shared"

export class KeyEntity extends BaseEntity<KeyEntity.Props>{

    private constructor(props: KeyEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: KeyEntity.Input, id?: string): KeyEntity {
        return new KeyEntity({
            ...input,
            key: input.key || KeyEntity.generateRandomKey(),
            status: "ACTIVE",
            keyRedeemerId: undefined
        }, id)
    }

    static generateRandomKey(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }


    disable(){
        if(this.isRedeemed()) return false
        this.props.status = "DISABLED"
        return true
    }

    activate(): boolean {
        if(this.isRedeemed()) return false
        this.props.status = "ACTIVE"
        return true
    }

    redeem(keyRedeemerId: string){
        this.props.keyRedeemerId = keyRedeemerId
        this.props.status = "REDEEMED"
    }

    isRedeemed() {
        return this.props.status === "REDEEMED"
    }

    toJSON(): KeyEntity.PropsJSON {
        return {
            id: this.id,
            serviceId: this.serviceId,
            key: this.key,
            validUntil: this.validUntil,
            status: this.status,
            keyRedeemerId: this.keyRedeemerId
        }
    }

    get serviceId(): string {
        return this.props.serviceId
    }
    get key(): string {
        return this.props.key
    }
    get validUntil(): number {
        return this.props.validUntil
    }
    get status(): KeyEntity.Status {
        return this.props.status
    }
    get keyRedeemerId(): string | undefined {
        return this.props.keyRedeemerId
    }
}

export namespace KeyEntity {

    export type Status = "ACTIVE" | "DISABLED" | "REDEEMED"

    export type Input = {
        key?: string
        serviceId: string
        validUntil: number
    }

    export type Props = {
        serviceId: string
        key: string
        validUntil: number
        status: Status
        keyRedeemerId?: string
    }

    export type PropsJSON = Props  & { id: string}
}


