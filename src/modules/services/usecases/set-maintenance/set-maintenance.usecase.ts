import { PrismaClient } from "@prisma/client";
import { PrismaServiceRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { UpdateNameDto } from "../../dto/update-name.dto";
import { ServiceNameAlreadyInUseError, ServiceNotFoundError } from "../_errors";
import { MaintananceSetEvent } from "./maintenance-set.event";
import { ServiceFacade } from "../../facades";
import { SetMaintananceErrorMapper } from "./errors";

export class SetMaintenanceUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({  serviceId }: { serviceId: string  }) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaServiceRepository = new PrismaServiceRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const serviceEntity = await prismaServiceRepository.findById(serviceId)
            if(!serviceEntity) throw new ServiceNotFoundError()

            const setMaintenanceResult = serviceEntity.setMaintenance()
            if(setMaintenanceResult.isFailure()) throw SetMaintananceErrorMapper.throwError(setMaintenanceResult.value)

            await prismaServiceRepository.update(serviceEntity)

            const maintananceSetEvent = new MaintananceSetEvent({
                serviceId: serviceEntity.id,
            })
            await prismaRabbitmqOutbox.publish(maintananceSetEvent)
        })
    }
}