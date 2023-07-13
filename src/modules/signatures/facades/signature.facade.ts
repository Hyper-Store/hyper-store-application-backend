import { PrismaClient } from "@prisma/client";
import { PrismaSignatureRepository } from "../repositories";
import { CreateSignatureUseCase } from "../usecase";

export class SignatureFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async exists(userId: string, serviceId: string): Promise<boolean> {
        const prismaSignatureRepository = new PrismaSignatureRepository(this.prismaClient)
        return !!await prismaSignatureRepository.findByUserIdAndServiceId(userId, serviceId)
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

}