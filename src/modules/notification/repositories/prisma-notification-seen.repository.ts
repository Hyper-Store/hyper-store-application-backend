import { PrismaClient } from "@prisma/client";
import { NotificationSeenEntity } from "../entities";


export class PrismaNotificationSeenRepository {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async create(notificationSeenEntity: NotificationSeenEntity): Promise<void> {
        await this.prismaClient.notificationSeen.create({
            data: {
                ...notificationSeenEntity.toJSON()
            }
        })
    }

    async find(userId: string, notificationId: string): Promise<boolean> {
        const notificationSeen = await this.prismaClient.notificationSeen.findFirst({
            where: {
                userId: userId ?? "",
                notificationId: notificationId ?? ""
            }
        })
        return !!notificationSeen
    }
}