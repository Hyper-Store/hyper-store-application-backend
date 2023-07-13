import { BaseEntity } from "src/modules/@shared";
import { hash, compare } from "bcrypt"


export class UserEntity extends BaseEntity<UserEntity.Props>{

    constructor(props: UserEntity.Props, id?: string){
        super(props, id)
    }

    async encryptPassword(password: string): Promise<string> {
        const encryptedPassword = await hash(password, 10)
        this.props.password = encryptedPassword
        return encryptedPassword
    }

    async comparePassword(password: string): Promise<boolean> {
        return compare(password, this.props.password) 
    }

    toJSON(): UserEntity.PropsJSON {
        return {
            id: this.id,
            email: this.props.email,
            username: this.props.username,
            password: this.props.password
        }
    }

    get email(): string {
        return this.props.email
    }
}

export namespace UserEntity {

    export type Props = {
        username: string
        email: string
        password: string
    }

    export type PropsJSON = Props  & { id: string}
}



