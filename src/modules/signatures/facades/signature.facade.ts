import { PrismaClient } from "@prisma/client";
import { PrismaSignatureRepository } from "../repositories";
import { CreateSignatureUseCase } from "../usecases";
import { ServiceFacade } from "src/modules/services/facades";
import { ServiceEntity } from "src/modules/services/entities";

export class SignatureFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async exists(userId: string, serviceId: string): Promise<boolean> {
        const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
        return !!await prismaSignatureRepository.findByUserIdAndServiceId(userId, serviceId)
    }

    async getSignatureDetails(id: string): Promise<SignatureFacade.SignatureDetails | null> {
        const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
        const serviceFacade = new ServiceFacade(this.prismaClient)
        const signatureEntity = await prismaSignatureRepository.findById(id)
        if(!signatureEntity) return null

        const serviceDetails = await serviceFacade.getServiceDetails(signatureEntity.serviceId)
        if(!serviceDetails) return null

        return {
            id: signatureEntity.id,
            isExpired: signatureEntity.isExpired(),
            expirationDate: signatureEntity.expirationDate,
            userId: signatureEntity.userId,
            quantityPerDay: signatureEntity.quantityPerDay,
            service: {
                id: serviceDetails.id,
                name: serviceDetails.name,
                type: serviceDetails.type as ServiceEntity.Type
            } 
        }
    }

    async isSignatureActive(userId: string, serviceId: string): Promise<boolean> {
        const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
        const signature = await prismaSignatureRepository.findByUserIdAndServiceId(userId, serviceId)
        if(!signature) return false
        return signature?.isExpired()
    }

    async create(input: SignatureFacade.CreateInput): Promise<boolean> {
        const createSignatureUseCase = new CreateSignatureUseCase(this.prismaClient)
        return await createSignatureUseCase.execute(input)
    }
}

export namespace SignatureFacade {

    export type CreateInput = {
        userId: string
        serviceId: string
    }

    export type SignatureDetails = {
        id: string
        isExpired: boolean
        userId: string
        expirationDate: Date
        quantityPerDay: number
        service: {
            id: string
            name: string
            type: ServiceEntity.Type
        }
    }

}