
import { PrismaClient } from "@prisma/client";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { PrismaNotificationRepository } from "../../repositories";
import { NotificationEntity } from "../../entities";
import { GlobalNotificationSentEvent } from "./global-notification-sent.event";



export class SendGlobalNotificationUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ notificationInfo, title }: SendGlobalNotificationUsecase.Input): Promise<void> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaNotificationRepository = new PrismaNotificationRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            
            const notificationEntity = NotificationEntity.create({
                title,
                notificationInfo,
                isGlobal: true
            })
            await prismaNotificationRepository.create(notificationEntity)

            const globalNotificationSentEvent = new GlobalNotificationSentEvent(notificationEntity.toJSON())
            await prismaRabbitmqOutbox.publish(globalNotificationSentEvent)
        })
    }
}

export namespace SendGlobalNotificationUsecase {

    export type Input = {
        title: string
        notificationInfo: NotificationEntity.NotificationInfo
    }
}