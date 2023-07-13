import { PrismaClient } from "@prisma/client";

export class SignatureFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async exists(userId: string, serviceId: string): Promise<boolean> {
        return false
    }

    async create(input: SignatureFacade.CreateInput): Promise<boolean> {
        return null
    }
}

export namespace SignatureFacade {

    export type CreateInput = {
        userId: string
        serviceId: string
    }

}