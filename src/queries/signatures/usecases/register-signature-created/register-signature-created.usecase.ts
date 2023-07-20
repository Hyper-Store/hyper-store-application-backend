import mongoose from "mongoose"
import { MongoNotificationQueryRepository } from "../../repositories"
import { SignatureModel } from "../../models"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"
import { PrismaClient } from "@prisma/client"
import { QuerySignatureRegisteredEvent } from "./query-signature-registered.event"
import { SignatureFacade } from "src/modules/signatures/facades"


export class RegisterSignatureCreatedUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(signatureModel: SignatureModel) {
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
        const signatureFacade = new SignatureFacade(this.prismaClient)
        const signatureDetails = await signatureFacade.getSignatureDetails(signatureModel.id)

        const mongoNotificationQueryRepository = new MongoNotificationQueryRepository(this.session)
        await mongoNotificationQueryRepository.create({
            ...signatureModel,
            serviceId: signatureDetails.service.id
        })

        const querySignatureRegisteredEvent = new QuerySignatureRegisteredEvent({
            ...signatureModel,
            serviceId: signatureDetails.service.id
        })
        await prismaRabbitmqOutbox.publish(querySignatureRegisteredEvent)
    }
}