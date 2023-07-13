import { PrismaClient } from "@prisma/client";
import { StatusChangeDto } from "../../dto/status-change.dto";
import { PrismaKeyRepository } from "../../respositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { KeyIsRedeemedError, KeyNotFoundError } from "../_errors";
import { KeyDisabledEvent } from "./key-disabled.event";
import { KeyAlreadyDisabledError } from "./errors";


class DisableKeyUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ key }: StatusChangeDto): Promise<void> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaKeyRepository = new PrismaKeyRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            
            const keyEntity = await prismaKeyRepository.findByKey(key) 
            if(!keyEntity) throw new KeyNotFoundError()

            if(!keyEntity.disable()) throw new KeyAlreadyDisabledError()

            const isSuccess = keyEntity.disable()
            if(!isSuccess) throw new KeyIsRedeemedError()
            await prismaKeyRepository.update(keyEntity)

            const keyDisabledEvent = new KeyDisabledEvent({
                key: keyEntity.key
            })
            await prismaRabbitmqOutbox.publish(keyDisabledEvent)
        })
    }
}