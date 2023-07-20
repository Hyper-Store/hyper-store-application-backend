import { PrismaClient } from "@prisma/client";
import { PrismaServiceRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { UpdateNameDto } from "../../dto/update-name.dto";
import { ServiceNameAlreadyInUseError, ServiceNotFoundError } from "../_errors";
import { MaintananceRemovedEvent } from "./maintenance-removed.event";
import { ServiceFacade } from "../../facades";
import { RemoveMaintananceErrorMapper } from "./errors";

export class RemoveMaintenanceUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({  serviceId }: { serviceId: string  }) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaServiceRepository = new PrismaServiceRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const serviceEntity = await prismaServiceRepository.findById(serviceId)
            if(!serviceEntity) throw new ServiceNotFoundError()

            const removeMaintenanceResult = serviceEntity.removeMaintenance()
            if(removeMaintenanceResult.isFailure()) throw RemoveMaintananceErrorMapper.throwError(removeMaintenanceResult.value)

            await prismaServiceRepository.update(serviceEntity)

            const maintananceRemovedEvent = new MaintananceRemovedEvent({
                serviceId: serviceEntity.id,
            })
            await prismaRabbitmqOutbox.publish(maintananceRemovedEvent)
        })
    }
}