import { PrismaClient } from "@prisma/client";
import { PrismaIdpotenceConsumer, PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { KeyFacade } from "src/modules/keys/facade";
import { SignatureFacade } from "src/modules/signatures/facades";
import { CreateSignatureFailedEvent, FailedGetKeyDetailsEvent, RedeemKeyProcessedEvent } from "./events";


export class ProcessRedeemKeyUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly consumerName: string,
        private readonly eventId: string
    ) {}

    async execute({ key }: ProcessRedeemKeyUsecase.Params) {
        
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaIdpotenceConsumer = new PrismaIdpotenceConsumer(prisma)
            const isEventRegistered = await prismaIdpotenceConsumer.isEventRegistered(this.eventId, this.consumerName)
            if(isEventRegistered) return

            const keyFacade = new KeyFacade(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            const signatureFacade = new SignatureFacade(prisma)
            
            const keyDetails = await keyFacade.consultKeyDetails(key)
            if(!keyDetails) {
                const failedGetKeyDetailsEvent = new FailedGetKeyDetailsEvent({ key })
                return await prismaRabbitmqOutbox.publish(failedGetKeyDetailsEvent)
            }
    
            const signatureExists = await signatureFacade.exists(keyDetails.keyRedeemerId!, keyDetails.serviceId)
            if(!signatureExists) {
                const isCreated = await signatureFacade.create({
                    userId: keyDetails.keyRedeemerId!,
                    serviceId: keyDetails.serviceId
                })
                if(!isCreated) {
                    const createSignatureFailedEvent = new CreateSignatureFailedEvent({ key })
                    return await prismaRabbitmqOutbox.publish(createSignatureFailedEvent)
                }
            }
            const redeemKeyProcessedEvent = new RedeemKeyProcessedEvent({ 
                validUntil: keyDetails.validUntil, 
                keyRedeemerId: keyDetails.keyRedeemerId!,
                serviceId: keyDetails.serviceId,
                quantityForDay: keyDetails.quantityForDay
            })
            await prismaRabbitmqOutbox.publish(redeemKeyProcessedEvent)
            await prismaIdpotenceConsumer.registerEvent(this.eventId, this.consumerName)
        })
    }

}

export namespace ProcessRedeemKeyUsecase {
    export type Params = {
        key: string
    }
}