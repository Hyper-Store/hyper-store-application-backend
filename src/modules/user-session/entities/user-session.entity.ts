import { BaseEntity } from "src/modules/@shared";
import { AccessTokenValueObject } from "./access-token.value-object";
import { RefreshTokenValueObject } from "./refresh-token.value-object";
import { Either, failure, success } from "src/modules/@shared/logic";



export class UserSessionEntity extends BaseEntity<UserSessionEntity.Props>{

    private constructor(props: UserSessionEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: UserSessionEntity.Input, id?: string): UserSessionEntity {


        const userSessionEntity = new UserSessionEntity({
            ...input,
            status: "ACTIVE",
            dateTimeCreated: input.dateTimeCreated ?? new Date(),
        }, id)
        return userSessionEntity
    }

    update(input: UserSessionEntity.Update) {
        if(input.ip) this.props.ip = input.ip
        if(input.userAgent) this.props.userAgent = input.userAgent
        if(input.accessToken) this.props.accessToken = input.accessToken
        if(input.refreshToken) this.props.refreshToken = input.refreshToken
        this.props.dateTimeCreated = new Date()
    }

    expireSession():  Either<string, null>{
        if(this.isSessionExpired()) return failure("SessionAlreadyExpiredError")
        this.props.status = "ACCESS_TOKEN_EXPIRED"
        return success(null)
    }

    activateSession():  Either<string, null> {
        if(this.isSessionActive()) return failure("SessionAlreadyActivatedError")
        this.props.status = "ACTIVE"
        return success(null)
    }

    isSessionExpired(): boolean {
        return this.props.status !== "ACTIVE"
    }
    isSessionActive(): boolean {
        return this.props.status === "ACTIVE"
    }

    toJSON(): UserSessionEntity.PropsJSON {
        return {
            id: this.id,
            userId: this.props.userId,
            ip: this.props.ip,
            userAgent: this.props.userAgent,
            accessToken: this.accessToken.toJSON(),
            refreshToken: this.refreshToken.toJSON(),
            status: this.props.status,
            dateTimeCreated: this.props.dateTimeCreated
        }
    }

    get accessToken(): AccessTokenValueObject {
        return this.props.accessToken
    }

    get refreshToken(): RefreshTokenValueObject {
        return this.props.refreshToken
    }

    get userId(): string {
        return this.props.userId
    }

    get ip(): string {
        return this.props.ip
    }

    get userAgent(): string {
        return this.props.userAgent
    }

    get dateTimeCreated(): Date {
        return this.props.dateTimeCreated
    }
}

export namespace UserSessionEntity {

    export type Status = "ACTIVE" | "ACCESS_TOKEN_EXPIRED"

    export type Update = Partial<Omit<Props, "userId" | "status">>

    export type Input = Omit<Props, "status" | "dateTimeCreated"> & { dateTimeCreated?: Date }

    export type Props = {
        userId: string
        ip: string
        userAgent: string
        accessToken: AccessTokenValueObject
        refreshToken: RefreshTokenValueObject
        status: Status
        dateTimeCreated: Date
    }

    export type PropsJSON = Omit<Props, "accessToken" | "refreshToken">  & { 
        id: string, 
        accessToken: AccessTokenValueObject.PropsJSON, 
        refreshToken: RefreshTokenValueObject.PropsJSON 
    }
}



