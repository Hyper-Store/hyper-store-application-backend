import { BaseEntity } from "src/modules/@shared"
import { Either, failure, success } from "src/modules/@shared/logic"

export class NotificationEntity extends BaseEntity<NotificationEntity.Props>{

    private constructor(props: NotificationEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: NotificationEntity.Input, id?: string): NotificationEntity {

        if(input.isGlobal === true){
            input.userId = undefined
            input.isSeen = true
        }

        return new NotificationEntity({
            ...input,
            isGlobal: input.isGlobal ?? false,
            isSeen: input.isSeen ?? false,
            dateTimeSent: input.dateTimeSent ?? new Date()
        }, id)
    }

    isGlobal(): boolean {
        return this.props.isGlobal
    }

    isSeen(): boolean {
        return this.props.isSeen
    }

    markAsSeen(): Either<"NotificationAlreadyMarkedAsSeenError" , null> {
        if(this.isSeen()) return failure("NotificationAlreadyMarkedAsSeenError")
        this.props.isSeen = true
        return success(null)
    }

    toJSON(): NotificationEntity.PropsJSON {
        return {
            id: this.id,
            title: this.title,
            isGlobal: this.isGlobal(),
            userId: this.userId,
            isSeen: this.isSeen(),
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


    export type Input = {
        title: string
        userId?: string
        isGlobal?: boolean
        dateTimeSent?: Date
        isSeen?: boolean
        notificationInfo: NotificationInfo
    }

    export type Props = {
        title: string
        isGlobal: boolean
        isSeen: boolean
        userId?: string
        notificationInfo: NotificationInfo
        dateTimeSent: Date
    }

    export type PropsJSON = Props  & { id: string}
}


