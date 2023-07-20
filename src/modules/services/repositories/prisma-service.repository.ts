import { PrismaClient, Service } from "@prisma/client";
import { ServiceEntity } from "../entities";

class PrismaServiceEntityMapper {

    static toDomain(prismaService: Service){
        const serviceEntity = new ServiceEntity(prismaService, prismaService.id)
        if(prismaService.isMaintenance) serviceEntity.setMaintenance()
        return serviceEntity
    }
}

export class PrismaServiceRepository {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async create(serviceEntity: ServiceEntity): Promise<void> {
        await this.prismaClient.service.create({
            data: {
                ...serviceEntity.toJSON()
            }
        })
    }

    async findByName(name: string): Promise<ServiceEntity | null> {
        const service = await this.prismaClient.service.findUnique({
            where: { name: name ?? "" }
        })
        if(!service) return null
        return PrismaServiceEntityMapper.toDomain(service) 
    }

    async findById(id: string): Promise<ServiceEntity | null> {
        const service = await this.prismaClient.service.findFirst({
            where: { id: id ?? "" }
        })        
        if(!service) return null
        return PrismaServiceEntityMapper.toDomain(service) 
    }

    async update(serviceEntity: ServiceEntity): Promise<void> {
        const { id, ...props } = serviceEntity.toJSON()
        await this.prismaClient.service.update({
            where: { id },
            data: {
                ...props
            }
        })
    }
}