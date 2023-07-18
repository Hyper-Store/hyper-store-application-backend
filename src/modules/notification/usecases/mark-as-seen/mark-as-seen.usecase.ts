
import { PrismaClient } from "@prisma/client";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { PrismaNotificationRepository, PrismaNotificationSeenRepository } from "../../repositories";
import { NotificationEntity, NotificationSeenEntity } from "../../entities";
import { Either, failure, success } from "src/modules/@shared/logic";
import { NotificationMarkedAsSeenEvent } from "./notification-marked-as-seen.event";



export class MarkAsSeenUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ notificationId, userId }: MarkAsSeenUsecase.Input): Promise<Either<MarkAsSeenUsecase.Errors, null>> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaNotificationSeenRepository = new PrismaNotificationSeenRepository(prisma)
            const prismaNotificationRepository = new PrismaNotificationRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

            const notificationEntity = await prismaNotificationRepository.findById(notificationId)
            if(!notificationEntity) return failure("NotificationNotFoundError")
            if(!notificationEntity.canBeSeenBy(userId)) return failure("NotificationNotFromUserError")

            const notificationAlreadySeen = await prismaNotificationSeenRepository.find(userId, notificationId)
            if(notificationAlreadySeen) return failure("NotificationAlreadyMarkedAsSeenError")

            const notificationSeenEntity = NotificationSeenEntity.create({
                userId,
                notificationId,
            })
            await prismaNotificationSeenRepository.create(notificationSeenEntity)

            const notificationMarkedAsSeenEvent = new NotificationMarkedAsSeenEvent(notificationSeenEntity.toJSON())
            await prismaRabbitmqOutbox.publish(notificationMarkedAsSeenEvent)

            return success(null)
        }) as any
    }
}

export namespace MarkAsSeenUsecase {

    export type Errors = "NotificationNotFoundError" | "NotificationNotFromUserError" | "NotificationAlreadyMarkedAsSeenError"

    export type Input = {
        notificationId: string
        userId: string
    }
}