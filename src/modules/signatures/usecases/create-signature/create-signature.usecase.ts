import { PrismaClient } from "@prisma/client";
import { CreateSignatureDto } from "../../dto";
import { PrismaSignatureRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { SignatureEntity } from "../../entities";
import { SignatureCreatedEvent } from "./signature-created.event";


export class CreateSignatureUseCase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: CreateSignatureDto): Promise<boolean> {
        const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)

        const signatureExists = await prismaSignatureRepository.findByUserIdAndServiceId(input.userId, input.serviceId)
        if(signatureExists) return false

        const signatureEntity = SignatureEntity.create({
            ...input,
            quantityPerDay: 1,
            expirationDate: undefined
        }) 
        await prismaSignatureRepository.create(signatureEntity)

        const signatureCreatedEvent = new SignatureCreatedEvent(signatureEntity.toJSON())
        await prismaRabbitmqOutbox.publish(signatureCreatedEvent)
        return true
    }
}