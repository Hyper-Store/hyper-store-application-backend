import { BaseEntity } from "src/modules/@shared"
import { Either, failure, success } from "src/modules/@shared/logic"

export class NotificationEntity extends BaseEntity<NotificationEntity.Props>{

    private constructor(props: NotificationEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: NotificationEntity.Input, id?: string): NotificationEntity {

        if(input.isGlobal === true){
            input.userId = undefined
        }

        return new NotificationEntity({
            ...input,
            isGlobal: input.isGlobal ?? false,
            dateTimeSent: input.dateTimeSent ?? new Date()
        }, id)
    }

    isGlobal(): boolean {
        return this.props.isGlobal
    }




    toJSON(): NotificationEntity.PropsJSON {
        return {
            id: this.id,
            title: this.title,
            isGlobal: this.isGlobal(),
            userId: this.userId,
            notificationInfo: this.notificationInfo,
            dateTimeSent: this.dateTimeSent
        }
    }

    get title(): string {
        return this.props.title
    }

    get userId(): string | undefined{
        return this.props.userId
    }

    get notificationInfo(): NotificationEntity.NotificationInfo {
        return this.props.notificationInfo
    }

    get dateTimeSent(): Date {
        return this.props.dateTimeSent
    }
}

export namespace NotificationEntity {

    export type Status = "ACTIVE" | "DISABLED" | "REDEEMED"
    export type NotificationInfo = {
        [ key: string ]: any
    }
    // KeyRedemmed 
    export type Input = {
        title: string
        userId?: string
        isGlobal?: boolean
        dateTimeSent?: Date
        notificationInfo: NotificationInfo
    }

    export type Props = {
        title: string
        isGlobal: boolean
        userId?: string
        notificationInfo: NotificationInfo
        dateTimeSent: Date
    }

    export type PropsJSON = Props  & { id: string}
}


