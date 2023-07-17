
import { PrismaClient } from "@prisma/client";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { PrismaNotificationRepository } from "../../repositories";
import { NotificationEntity } from "../../entities";
import { NotificationSentEvent } from "./notification-sent.event";



export class SendNotificationUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ notificationInfo, title, userId }: SendNotificationUsecase.Input): Promise<void> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaNotificationRepository = new PrismaNotificationRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            
            const notificationEntity = NotificationEntity.create({
                title,
                userId,
                notificationInfo
            })
            await prismaNotificationRepository.create(notificationEntity)

            const notificationSentEvent = new NotificationSentEvent(notificationEntity.toJSON())
            await prismaRabbitmqOutbox.publish(notificationSentEvent)
        })
    }
}

export namespace SendNotificationUsecase {

    export type Input = {
        title: string
        userId: string
        notificationInfo: NotificationEntity.NotificationInfo
    }
}