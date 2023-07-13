import { PrismaClient } from "@prisma/client";
import { CreateKeyDto } from "../../dto/create-key.dto";
import { KeyEntity } from "../../entities";
import { ServiceFacade } from "src/modules/services/facades";
import { PrismaKeyRepository } from "../../respositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { ServiceNotFoundError } from "./errors";
import { KeyGeneratedEvent } from "./key-generated.event";

export class GenerateKeyUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: CreateKeyDto) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaKeyRepository = new PrismaKeyRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            const serviceFacade = new ServiceFacade(prisma)

            const serviceExists = await serviceFacade.serviceExists(input.serviceId)
            if(!serviceExists) throw new ServiceNotFoundError()

            const keyEntity = KeyEntity.create(input)
            await prismaKeyRepository.create(keyEntity)

            const keyGeneratedEvent = new KeyGeneratedEvent({
                ...keyEntity.toJSON()
            })
            await prismaRabbitmqOutbox.publish(keyGeneratedEvent)

            return { id: keyEntity.id };
        })
    }
}