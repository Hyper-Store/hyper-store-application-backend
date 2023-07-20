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

    async isServiceInMaintenance(serviceId: string): Promise<boolean> {
        const prismaServiceRepository = new PrismaServiceRepository(this.prismaClient)
        const serviceEntity = await prismaServiceRepository.findById(serviceId)
        if(!serviceEntity) return false
        return serviceEntity.isMaintenance()
    }

    async serviceNameExists(name: string): Promise<boolean> {
        const prismaServiceRepository = new PrismaServiceRepository(this.prismaClient)
        return !!await prismaServiceRepository.findByName(name)
    }

    async getServiceDetails(id: string): Promise<ServiceFacade.ServiceDetails | null> {
        const prismaServiceRepository = new PrismaServiceRepository(this.prismaClient)
        const serviceEntity = await prismaServiceRepository.findById(id)
        if(!serviceEntity) return null
        return {
            ...serviceEntity.toJSON()
        }
    }
}

export namespace ServiceFacade {

    export type ServiceDetails = {
        id: string
        name: string
        type: string
        isMaintenance: boolean
    }
}