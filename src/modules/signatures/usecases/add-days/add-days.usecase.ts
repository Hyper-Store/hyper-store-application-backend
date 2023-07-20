import { PrismaClient } from "@prisma/client";
import { PrismaSignatureRepository } from "../../repositories";
import { PrismaIdpotenceConsumer, PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { AddDaysFailedEvent, DaysAddedEvent } from "./events";

export class AddDaysUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly consumerName: string,
        private readonly eventId: string
    ){}

    async execute(input: AddDaysUsecase.Input): Promise<void> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaIdpotenceConsumer = new PrismaIdpotenceConsumer(prisma)
            const isEventRegistered = await prismaIdpotenceConsumer.isEventRegistered(this.eventId, this.consumerName)
            if(isEventRegistered) return
    
            const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
    
            const signatureEntity = await prismaSignatureRepository.findByUserIdAndServiceId(input.userId, input.serviceId)
            if(!signatureEntity) {
                const addDaysFailedEvent = new AddDaysFailedEvent(input)
                return await prismaRabbitmqOutbox.publish(addDaysFailedEvent)
            }
    
            signatureEntity.addDays(input.days)
            await prismaSignatureRepository.update(signatureEntity)
    
            const daysAddedEvent = new DaysAddedEvent({
                signatureId: signatureEntity.id,
                daysAdded: input.days,
                expirationDate: signatureEntity.expirationDate,
            })
            await prismaRabbitmqOutbox.publish(daysAddedEvent)
            await prismaIdpotenceConsumer.registerEvent(this.eventId, this.consumerName)
        })
    }
}

export namespace AddDaysUsecase {
    
    export type Input = {
        userId: string
        serviceId: string
        days: number
    }
}