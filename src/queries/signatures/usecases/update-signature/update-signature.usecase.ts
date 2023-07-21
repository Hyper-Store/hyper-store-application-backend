import mongoose from "mongoose"
import { MongoSignatureRepository } from "../../repositories"
import { SignatureModel } from "../../models"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"
import { PrismaClient } from "@prisma/client"
import { QuerySignatureUpdatedEvent } from "./query-signature-updated.event"


export class UpdateSignatureUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly session: mongoose.mongo.ClientSession
    ) {}
    
    async execute(signatureModel: Partial<SignatureModel> ) {
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
        const mongoSignatureRepository = new MongoSignatureRepository(this.session)

        const signature = await mongoSignatureRepository.findById(signatureModel.id)

        await mongoSignatureRepository.update(signatureModel)

        const querySignatureUpdatedEvent = new QuerySignatureUpdatedEvent({
            ...signatureModel,
            userId: signature?.userId ?? "",
        })
        await prismaRabbitmqOutbox.publish(querySignatureUpdatedEvent)
    }
}