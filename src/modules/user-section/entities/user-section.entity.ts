import { BaseEntity } from "src/modules/@shared";


export class UserSectionEntity extends BaseEntity<UserSectionEntity.Props>{

    constructor(props: UserSectionEntity.Props, id?: string){
        super(props, id)
    }

    update(input: UserSectionEntity.Update) {
        if(input.ip) this.props.ip = input.ip
        if(input.userAgent) this.props.userAgent = input.userAgent
        if(input.accessToken) this.props.accessToken = input.accessToken
    }

    toJSON(): UserSectionEntity.PropsJSON {
        return {
            id: this.id,
            userId: this.props.userId,
            ip: this.props.ip,
            userAgent: this.props.userAgent,
            accessToken: this.props.accessToken        
        }
    }

}

export namespace UserSectionEntity {

    export type Update = {
        ip?: string
        userAgent?: string
        accessToken?: string
    }

    export type Props = {
        userId: string
        ip: string
        userAgent: string
        accessToken: string
    }

    export type PropsJSON = Props  & { id: string}
}



