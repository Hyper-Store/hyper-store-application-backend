import { PrismaClient } from "@prisma/client";
import { NotificationEntity } from "../entities";


export class PrismaNotificationRepository {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async create(notificationEntity: NotificationEntity): Promise<void> {
        await this.prismaClient.notification.create({
            data: {
                ...notificationEntity.toJSON(),
                notificationInfo: JSON.stringify(notificationEntity.notificationInfo),
            }
        })
    }

    async findById(id: string): Promise<NotificationEntity | null> {
        const prismaNotification = await this.prismaClient.notification.findFirst({
            where: { id: id ?? "" }
        })
        if(!prismaNotification) return null
        return NotificationEntity.create({
            ...prismaNotification,
            notificationInfo: JSON.parse(prismaNotification.notificationInfo)
        }, prismaNotification.id)
    }

    async update(notificationEntity: NotificationEntity): Promise<void> {
        const { id, userId, ...props } = notificationEntity.toJSON()
        await this.prismaClient.notification.update({
            where: { id: id ?? "" },
            data: {
                ...props
            }
        })
    }
}