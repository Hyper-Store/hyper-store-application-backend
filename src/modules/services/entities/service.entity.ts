import { BaseEntity } from "src/modules/@shared"
import { Either, failure, success } from "src/modules/@shared/logic"

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

    changeName(name: string): Either<string, null> {
        if(this.name === name) return failure("NameIsTheSameError")
        this.props.name = name
        return success(null)
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


