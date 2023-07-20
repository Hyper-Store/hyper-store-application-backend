import mongoose from "mongoose"
import { MongoNotificationQueryRepository } from "../../repositories"
import { SignatureModel } from "../../models"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"
import { PrismaClient } from "@prisma/client"
import { QuerySignatureRegisteredEvent } from "./query-signature-registered.event"


export class RegisterSignatureCreatedUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(signatureModel: SignatureModel) {
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
        const mongoNotificationQueryRepository = new MongoNotificationQueryRepository(this.session)
        await mongoNotificationQueryRepository.create(signatureModel)

        const querySignatureRegisteredEvent = new QuerySignatureRegisteredEvent({
            ...signatureModel
        })
        await prismaRabbitmqOutbox.publish(querySignatureRegisteredEvent)
    }
}