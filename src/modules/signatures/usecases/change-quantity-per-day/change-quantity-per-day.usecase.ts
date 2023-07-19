import { PrismaClient } from "@prisma/client";
import { PrismaSignatureRepository } from "../../repositories";
import { PrismaIdpotenceConsumer, PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { QuantityPerDayChangedEvent } from "./quantity-per-day-changed.event";

export class ChangeQuantityPerDayUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly consumerName: string,
        private readonly eventId: string
    ){}

    async execute(input: ChangeQuantityPerDayUsecase.Input): Promise<void> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaIdpotenceConsumer = new PrismaIdpotenceConsumer(prisma)
            const isEventRegistered = await prismaIdpotenceConsumer.isEventRegistered(this.eventId, this.consumerName)
            if(isEventRegistered) return
    
            const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
    
            const signatureEntity = await prismaSignatureRepository.findByUserIdAndServiceId(input.userId, input.serviceId)
            if(!signatureEntity) {
                return
                // const addDaysFailedEvent = new AddDaysFailedEvent(input)
                // return await prismaRabbitmqOutbox.publish(addDaysFailedEvent)
            }

            signatureEntity.changeQuantityPerDay(input.quantityPerDay)
            await prismaSignatureRepository.update(signatureEntity)
    
            const quantityPerDayChangedEvent = new QuantityPerDayChangedEvent({
                signatureId: signatureEntity.id,
                quantityPerDay: signatureEntity.quantityPerDay
            })
            await prismaRabbitmqOutbox.publish(quantityPerDayChangedEvent)
            await prismaIdpotenceConsumer.registerEvent(this.eventId, this.consumerName)
        })
    }
}

export namespace ChangeQuantityPerDayUsecase {
    
    export type Input = {
        quantityPerDay: number
        userId: string
        serviceId: string
    }
}