
export interface NotificationQueryModel  {
    id: string;
    title: string
    userId: string
    isGlobal: boolean
    dateTimeSent: Date
    isSeen: boolean
    notificationInfo: {
        [ key: string ]: any
    }
}