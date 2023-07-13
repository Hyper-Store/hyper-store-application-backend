import { PrismaClient } from "@prisma/client";
import { PrismaServiceRepository } from "../repositories";

export class ServiceFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async serviceExists(serviceId: string): Promise<boolean> {
        const prismaServiceRepository = new PrismaServiceRepository(this.prismaClient)
        return !!await prismaServiceRepository.findById(serviceId)
    }
}