import { BaseEntity } from "src/modules/@shared";
import { hash, compare } from "bcrypt"


export class UserEntity extends BaseEntity<UserEntity.Props>{

    constructor(props: Omit<UserEntity.Props, "isBanned">, id?: string){
        super({...props, isBanned: false }, id)
    }

    async encryptPassword(password: string): Promise<string> {
        const encryptedPassword = await hash(password, 10)
        this.props.password = encryptedPassword
        return encryptedPassword
    }

    ban(){
        this.props.isBanned = true
    }

    unban(){
        this.props.isBanned = false
    }

    isBanned(): boolean {
        return this.props.isBanned
    }


    async comparePassword(password: string): Promise<boolean> {
        return compare(password, this.props.password) 
    }

    toJSON(): UserEntity.PropsJSON {
        return {
            id: this.id,
            email: this.props.email,
            username: this.props.username,
            password: this.props.password,
            isBanned: this.isBanned()
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
        isBanned: boolean
    }

    export type PropsJSON = Props  & { id: string}
}



