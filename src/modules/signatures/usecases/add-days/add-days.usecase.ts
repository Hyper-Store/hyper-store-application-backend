import { PrismaClient } from "@prisma/client";
import { PrismaSignatureRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { DaysAddedEvent } from "./days-added.event";

export class AddDaysUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: AddDaysUsecase.Input): Promise<boolean> {
        const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)

        const signatureEntity = await prismaSignatureRepository.findByUserIdAndServiceId(input.userId, input.serviceId)
        if(signatureEntity) return false

        signatureEntity.addDays(input.days)
        await prismaSignatureRepository.update(signatureEntity)

        const daysAddedEvent = new DaysAddedEvent({
            signatureId: signatureEntity.id,
            expirationDate: signatureEntity.expirationDate,
        })
        await prismaRabbitmqOutbox.publish(daysAddedEvent)
        return true
    }
}

export namespace AddDaysUsecase {
    
    export type Input = {
        userId: string
        serviceId: string
        days: number
    }
}