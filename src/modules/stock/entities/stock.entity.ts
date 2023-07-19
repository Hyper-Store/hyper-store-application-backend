import { BaseEntity } from "src/modules/@shared"

export class StockEntity extends BaseEntity<StockEntity.Props>{

    private constructor(props: StockEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: StockEntity.Input, id?: string): StockEntity {
        if(input.type !== "ROCKSTAR") input.type = "ROCKSTAR"
        return new StockEntity({
            ...input,
            type: input.type as StockEntity.Type
        }, id)
    }



    toJSON(): StockEntity.PropsJSON {
        return {
            id: this.id,
            value: this.value,
            type: this.type
        }
    }

    get value() {
        return this.props.value
    }

    get type() {
        return this.props.type
    }
}

export namespace StockEntity {

    export type Type = "ROCKSTAR"

    export type Input = {
        value: string
        type: string
    }

    export type Props = {
        value: string
        type: Type
    }

    export type PropsJSON = Props  & { id: string}
}


