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

    changeQuantityPerDay(quantityPerDay: number): void {
        this.props.quantityPerDay = quantityPerDay
    }

    toJSON(): SignatureEntity.PropsJSON {
        return {
            id: this.id,
            userId: this.userId,
            serviceId: this.serviceId,
            expirationDate: this.expirationDate,
            quantityPerDay: this.quantityPerDay
        }
    }

    isExpired(): boolean {
        return this.expirationDate.getTime() < Date.now()
    }

    expire(): void {
        this.props.expirationDate = new Date()
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
    get quantityPerDay() {
        return this.props.quantityPerDay
    }
}

export namespace SignatureEntity {

    export type Input = {
        userId: string
        serviceId: string
        expirationDate?: Date
        quantityPerDay: number
    }

    export type Props = {
        userId: string
        serviceId: string
        expirationDate: Date
        quantityPerDay: number
    }

    export type PropsJSON = Props  & { id: string}
}

