import { PrismaClient } from "@prisma/client";
import { PrismaSignatureRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { AllSignaturesExpiredEvent } from "./all-signatures-expired.event";


export class ExpireAllSignaturesUseCase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ userId }: ExpireAllSignaturesUseCase.Input): Promise<boolean> {
        const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)

        const signatures = await prismaSignatureRepository.findAllSignaturesByUserId(userId)
        if(signatures.length === 0) return false

        for(const signature of signatures) {
            signature.expire()
            await prismaSignatureRepository.update(signature)
        }

        const signatureCreatedEvent = new AllSignaturesExpiredEvent({
            userId
        })
        await prismaRabbitmqOutbox.publish(signatureCreatedEvent)
        return true
    }
}


export namespace ExpireAllSignaturesUseCase {
    export type Input = {
        userId: string
    }
}
