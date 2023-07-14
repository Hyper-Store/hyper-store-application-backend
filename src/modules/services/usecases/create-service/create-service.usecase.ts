import { PrismaClient } from "@prisma/client";
import { CreateServiceDto } from "../../dto/create-service.dto";
import { ServiceEntity } from "../../entities";
import { PrismaServiceRepository } from "../../repositories";
import { ServiceAlreadyExistsError } from "./errors";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { ServiceCreatedEvent } from "./service-created.event";
import { ServiceNameAlreadyInUseError } from "../_errors";


export class CreateServiceUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: CreateServiceDto) {

        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaServiceRepository = new PrismaServiceRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const serviceAlreadyExists = await prismaServiceRepository.findByName(input.name)
            if(serviceAlreadyExists) throw new ServiceNameAlreadyInUseError()
    
            const serviceEntity = new ServiceEntity(input)
            await prismaServiceRepository.create(serviceEntity)
    
            const userCreatedEvent = new ServiceCreatedEvent({
                ...serviceEntity.toJSON()
            })
            await prismaRabbitmqOutbox.publish(userCreatedEvent)
    
            return { id: serviceEntity.id };
        })
    }
}