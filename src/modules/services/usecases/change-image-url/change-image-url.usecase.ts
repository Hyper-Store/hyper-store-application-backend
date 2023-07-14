
import { PrismaClient } from "@prisma/client";
import { PrismaServiceRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { UpdateImageUrlDto } from "../../dto";
import { ServiceNameAlreadyInUseError, ServiceNotFoundError } from "../_errors";
import { ImageUrlChangedEvent } from "./image-url-changed.event";
import { ServiceFacade } from "../../facades";
import { ChangeImageUrlErrorMapper } from "./errors";

export class ChangeImageUrlUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ imageUrl, serviceId }: UpdateImageUrlDto & { serviceId: string  }) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaServiceRepository = new PrismaServiceRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const serviceEntity = await prismaServiceRepository.findById(serviceId)
            if(!serviceEntity) throw new ServiceNotFoundError()

            const changeNameResult = serviceEntity.changeImageUrl(imageUrl)
            if(changeNameResult.isFailure()) throw ChangeImageUrlErrorMapper.throwError(changeNameResult.value)

            await prismaServiceRepository.update(serviceEntity)

            const imageUrlChangedEvent = new ImageUrlChangedEvent({
                serviceId: serviceEntity.id,
                imageUrl: serviceEntity.imageUrl
            })
            await prismaRabbitmqOutbox.publish(imageUrlChangedEvent)
        })
    }
}