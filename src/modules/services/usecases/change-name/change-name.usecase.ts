import { PrismaClient } from "@prisma/client";
import { PrismaServiceRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { UpdateNameDto } from "../../dto/update-name.dto";
import { ServiceNameAlreadyInUseError, ServiceNotFoundError } from "../_errors";
import { NameChangedEvent } from "./name-changed.event";
import { ServiceFacade } from "../../facades";
import { ChangeNameErrorMapper } from "./errors";

export class ChangeNameUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ name, serviceId }: UpdateNameDto & { serviceId: string  }) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaServiceRepository = new PrismaServiceRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            const serviceFacade = new ServiceFacade(prisma)
    
            const serviceEntity = await prismaServiceRepository.findById(serviceId)
            if(!serviceEntity) throw new ServiceNotFoundError()
    
            const serviceNameExists = await serviceFacade.serviceNameExists(name)
            if(serviceNameExists) throw new ServiceNameAlreadyInUseError()

            const changeNameResult = serviceEntity.changeName(name)
            if(changeNameResult.isFailure()) throw ChangeNameErrorMapper.throwError(changeNameResult.value)

            await prismaServiceRepository.update(serviceEntity)

            const nameChangedEvent = new NameChangedEvent({
                serviceId: serviceEntity.id,
            })
            await prismaRabbitmqOutbox.publish(nameChangedEvent)
        })
    }
}