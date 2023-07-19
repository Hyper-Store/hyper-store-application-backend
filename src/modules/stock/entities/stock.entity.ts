import { BaseEntity } from "src/modules/@shared"

export class StockEntity extends BaseEntity<StockEntity.Props>{

    private constructor(props: StockEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: StockEntity.Input, id?: string): StockEntity {
        return new StockEntity({
            ...input
        }, id)
    }



    toJSON(): StockEntity.PropsJSON {
        return {
            id: this.id,
            value: this.value,
            serviceId: this.serviceId
        }
    }

    get value() {
        return this.props.value
    }

    get serviceId() {
        return this.props.serviceId
    }
}

export namespace StockEntity {

    export type Input = {
        value: string
        serviceId: string
    }

    export type Props = {
        value: string
        serviceId: string
    }

    export type PropsJSON = Props  & { id: string}
}


