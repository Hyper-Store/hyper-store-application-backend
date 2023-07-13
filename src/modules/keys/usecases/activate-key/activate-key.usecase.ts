import { PrismaClient } from "@prisma/client";
import { StatusChangeDto } from "../../dto/status-change.dto";
import { PrismaKeyRepository } from "../../respositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { KeyIsRedeemedError, KeyNotFoundError } from "../_errors";
import { KeyActivatedEvent } from "./key-activated.event";
import { KeyAlreadyActivatedError } from "./errors";


export class ActivateKeyUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ key }: StatusChangeDto): Promise<void> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaKeyRepository = new PrismaKeyRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            
            const keyEntity = await prismaKeyRepository.findByKey(key) 
            if(!keyEntity) throw new KeyNotFoundError()

            if(!keyEntity.isActivated()) throw new KeyAlreadyActivatedError()

            const isSuccess = keyEntity.activate()
            if(!isSuccess) throw new KeyIsRedeemedError()
            await prismaKeyRepository.update(keyEntity)

            const keyActivatedEvent = new KeyActivatedEvent({
                key: keyEntity.key
            })
            await prismaRabbitmqOutbox.publish(keyActivatedEvent)
        })
    }
}