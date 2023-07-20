import { PrismaClient } from "@prisma/client"
import { SignatureFacade } from "src/modules/signatures/facades"
import { KeyRedemptionInfoProcessedEvent } from "./key-redemption-info-processed.event"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"

export class ProcessKeyRedemptionInfoUsecase {
    constructor(
        private readonly prismaClient: PrismaClient
    ) {}
    
    async execute({ daysAdded, signatureId }: ProcessKeyRedemptionInfoUsecase.Input) {
        const signatureFacade = new SignatureFacade(this.prismaClient)
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
        const signatureDetails = await signatureFacade.getSignatureDetails(signatureId)

        const keyRedemptionInfoProcessedEvent = new KeyRedemptionInfoProcessedEvent({
            userId: signatureDetails?.userId,
            daysAdded,
            expirationDate: signatureDetails?.expirationDate,
            serviceName: signatureDetails?.service?.name,
        })
        await prismaRabbitmqOutbox.publish(keyRedemptionInfoProcessedEvent)
    }
}

export namespace ProcessKeyRedemptionInfoUsecase {
    export type Input = {
        signatureId: string
        daysAdded: number
    }
}