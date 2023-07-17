
import { PrismaClient } from "@prisma/client";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { PrismaNotificationRepository } from "../../repositories";
import { NotificationEntity } from "../../entities";
import { Either, failure, success } from "src/modules/@shared/logic";
import { NotificationMarkedAsSeenEvent } from "./notification-marked-as-seen.event";



export class MarkAsSeenUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ notificationId, userId }: MarkAsSeenUsecase.Input): Promise<Either<MarkAsSeenUsecase.Errors, null>> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaNotificationRepository = new PrismaNotificationRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

            const notificationEntity = await prismaNotificationRepository.findById(notificationId)
            if(!notificationEntity) return failure("NotificationNotFoundError")

            if(notificationEntity.userId !== userId) return failure("NotificationNotFromUserError")

            const markAsSeenResult = notificationEntity.markAsSeen()
            if(markAsSeenResult.isFailure()) return failure(markAsSeenResult.value)

            prismaNotificationRepository.update(notificationEntity)

            const notificationMarkedAsSeenEvent = new NotificationMarkedAsSeenEvent({ 
                notificationId: notificationEntity.id 
            })
            await prismaRabbitmqOutbox.publish(notificationMarkedAsSeenEvent)

            return success(null)
        }) as any
    }
}

export namespace MarkAsSeenUsecase {

    export type Errors = "NotificationNotFoundError" | "NotificationNotFromUserError"

    export type Input = {
        notificationId: string
        userId: string
    }
}