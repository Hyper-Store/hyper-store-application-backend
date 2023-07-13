import { PrismaClient } from "@prisma/client";
import { PrismaSignatureRepository } from "../../repositories";
import { PrismaIdpotenceConsumer, PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { DaysAddedEvent } from "./days-added.event";

export class AddDaysUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly consumerName: string,
        private readonly eventId: string
    ){}

    async execute(input: AddDaysUsecase.Input): Promise<boolean> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaIdpotenceConsumer = new PrismaIdpotenceConsumer(prisma)
            const isEventRegistered = await prismaIdpotenceConsumer.isEventRegistered(this.eventId, this.consumerName)
            if(isEventRegistered) return
    
            const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
    
            const signatureEntity = await prismaSignatureRepository.findByUserIdAndServiceId(input.userId, input.serviceId)
            if(!signatureEntity) return false
    
            signatureEntity.addDays(input.days)
            await prismaSignatureRepository.update(signatureEntity)
    
            const daysAddedEvent = new DaysAddedEvent({
                signatureId: signatureEntity.id,
                expirationDate: signatureEntity.expirationDate,
            })
            await prismaRabbitmqOutbox.publish(daysAddedEvent)
            await prismaIdpotenceConsumer.registerEvent(this.eventId, this.consumerName)
            return true
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