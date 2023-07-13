import { BaseEntity } from "src/modules/@shared";


export class UserSectionEntity extends BaseEntity<UserSectionEntity.Props>{

    constructor(props: UserSectionEntity.Props, id?: string){
        super(props, id)
    }


    toJSON(): UserSectionEntity.PropsJSON {
        return {
            id: this.id,
            userId: this.props.userId,
            ip: this.props.ip,
            userAgent: this.props.userAgent,
            accesstoken: this.props.accesstoken        
        }
    }

}

export namespace UserSectionEntity {

    export type Props = {
        userId: string
        ip: string
        userAgent: string
        accesstoken: string
    }

    export type PropsJSON = Props  & { id: string}
}



