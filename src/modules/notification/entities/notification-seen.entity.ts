import { BaseEntity } from "src/modules/@shared"

export class NotificationSeenEntity extends BaseEntity<NotificationSeenEntity.Props>{

    private constructor(props: NotificationSeenEntity.Props, id?: string){
        super(props, id)
    }

    static create(input: NotificationSeenEntity.Input, id?: string): NotificationSeenEntity {
        return new NotificationSeenEntity({
            ...input,
            dateTimeSeen: input.dateTimeSeen ?? new Date()
        })
    }


    toJSON(): NotificationSeenEntity.PropsJSON {
        return {
            id: this.id,
            userId: this.userId,
            notificationId: this.notificationId,
            dateTimeSeen: this.dateTimeSeen
        }
    }



    get userId(): string {
        return this.props.userId
    }

    get notificationId(): string {
        return this.props.notificationId
    }

    get dateTimeSeen(): Date {
        return this.props.dateTimeSeen
    }
   
}

export namespace NotificationSeenEntity {

    export type Input = {
        userId: string
        notificationId: string
        dateTimeSeen?: Date
    }

    export type Props = {
        userId: string
        notificationId: string
        dateTimeSeen: Date
    }

    export type PropsJSON = Props  & { id: string}
}


