import { BaseEntity } from "src/modules/@shared"

export class ServiceEntity extends BaseEntity<ServiceEntity.Props>{

    constructor(props: ServiceEntity.Props, id?: string){
        super(props, id)
    }

    toJSON(): ServiceEntity.PropsJSON {
        return {
            id: this.id,
            name: this.name,
            imageUrl: this.imageUrl
        }
    }

    get name() {
        return this.props.name
    }

    get imageUrl() {
        return this.props.imageUrl
    }
}

export namespace ServiceEntity {

    export type Props = {
        name: string
        imageUrl: string
    }

    export type PropsJSON = Props  & { id: string}
}


