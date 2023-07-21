import { BaseEntity } from "src/modules/@shared"

export class StockRedemptionEntity extends BaseEntity<StockRedemptionEntity.Props>{

    private constructor(props: StockRedemptionEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: StockRedemptionEntity.Input, id?: string): StockRedemptionEntity {
        return new StockRedemptionEntity({
            ...input,
            dateTimeRedeemed: input.dateTimeRedeemed || new Date()
        }, id)
    }


    toJSON(): StockRedemptionEntity.PropsJSON {
        return {
            id: this.id,
            stockId: this.stockId,
            signatureId: this.signatureId,
            dateTimeRedeemed: this.dateTimeRedeemed,
            userId: this.userId
        }
    }

    get stockId(): string {
        return this.props.stockId
    }

    get signatureId(): string {
        return this.props.signatureId
    }

    get dateTimeRedeemed(): Date {
        return this.props.dateTimeRedeemed
    }

    get userId(): string {
        return this.props.userId
    }
}

export namespace StockRedemptionEntity {

    export type Input = {
        stockId: string
        userId: string
        signatureId: string
        dateTimeRedeemed?: Date
    }

    export type Props = {
        userId: string
        stockId: string
        signatureId: string
        dateTimeRedeemed: Date
    }

    export type PropsJSON = Props  & { id: string}
}


