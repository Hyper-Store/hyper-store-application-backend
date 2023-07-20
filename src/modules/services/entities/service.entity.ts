import { BaseEntity } from "src/modules/@shared"
import { Either, failure, success } from "src/modules/@shared/logic"

export class ServiceEntity extends BaseEntity<ServiceEntity.Props>{

    constructor(props: ServiceEntity.Input, id?: string){
        if(props.type !== "ACCOUNT_GENERATOR") props.type = "ACCOUNT_GENERATOR"
        super({
            ...props,
            type: props.type as ServiceEntity.Type,
            isMaintenance: false
        }, id)
    }

    toJSON(): ServiceEntity.PropsJSON {
        return {
            id: this.id,
            name: this.name,
            imageUrl: this.imageUrl,
            type: this.type,
            isMaintenance: this.isMaintenance()
        }
    }

    changeName(name: string): Either<string, null> {
        if(this.name === name) return failure("NameIsTheSameError")
        this.props.name = name
        return success(null)
    }

    changeImageUrl(imageUrl: string): Either<string, null> {
        if(this.imageUrl === imageUrl) return failure("ImageUrlIsTheSameError")
        this.props.imageUrl = imageUrl
        return success(null)
    }

    isMaintenance() {
        return this.props.isMaintenance
    }

    setMaintenance(): Either<"ServiceAlreadyIsInMaintenanceError", null> {
        if(this.isMaintenance()) return failure("ServiceAlreadyIsInMaintenanceError")
        this.props.isMaintenance = true
        return success(null)
    }

    removeMaintenance(): Either<"ServiceAlreadyIsNotInMaintenanceError", null> {
        if(!this.isMaintenance()) return failure("ServiceAlreadyIsNotInMaintenanceError")
        this.props.isMaintenance = false
        return success(null)
    }
    


    get name() {
        return this.props.name
    }

    get imageUrl() {
        return this.props.imageUrl
    }
    get type(): ServiceEntity.Type{
        return this.props.type
    }
}

export namespace ServiceEntity {

    export type Type = "ACCOUNT_GENERATOR"

    export type Input = {
        name: string
        imageUrl: string
        type: string
    }

    export type Props = {
        name: string
        imageUrl: string
        type: Type
        isMaintenance: boolean
    }

    export type PropsJSON = Props  & { id: string}
}


