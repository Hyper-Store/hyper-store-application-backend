import { BaseEntity } from "src/modules/@shared"

export class SignatureEntity extends BaseEntity<SignatureEntity.Props>{

    private constructor(props: SignatureEntity.Props, id?: string){
        super(props, id)
    }

    static create(props: SignatureEntity.Input, id?: string): SignatureEntity  {
        const signatureEntity = new SignatureEntity({
            ...props,
            expirationDate: props.expirationDate || new Date()
        }, id)
        return signatureEntity
    }

    addDays(days: number): void {
        if(this.isExpired()) {
            this.props.expirationDate = new Date()
        }
        const expirationDate = this.expirationDate
        this.expirationDate.setDate(expirationDate.getDate() + days)
    }

    toJSON(): SignatureEntity.PropsJSON {
        return {
            id: this.id,
            userId: this.userId,
            serviceId: this.serviceId,
            expirationDate: this.expirationDate,
        }
    }

    isExpired(): boolean {
        return this.expirationDate.getTime() < Date.now()
    }

    get userId() {
        return this.props.userId
    }
    get serviceId() {
        return this.props.serviceId
    }
    get expirationDate() {
        return this.props.expirationDate
    }
}

export namespace SignatureEntity {

    export type Input = {
        userId: string
        serviceId: string
        expirationDate?: Date
    }

    export type Props = {
        userId: string
        serviceId: string
        expirationDate: Date
    }

    export type PropsJSON = Props  & { id: string}
}

