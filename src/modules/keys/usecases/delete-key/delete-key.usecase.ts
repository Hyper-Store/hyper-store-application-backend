import { PrismaClient } from "@prisma/client";
import { StatusChangeDto } from "../../dto/status-change.dto";
import { PrismaKeyRepository } from "../../respositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import {  KeyNotFoundError } from "../_errors";
import { KeyDeletedEvent } from "./key-deleted.event";


export class DeleteKeyUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ key }: DeleteKeyUsecase.Input): Promise<void> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaKeyRepository = new PrismaKeyRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            
            const keyEntity = await prismaKeyRepository.findByKey(key) 
            if(!keyEntity) throw new KeyNotFoundError()

            await prismaKeyRepository.delete(keyEntity.id)

            const keyDeletedEvent = new KeyDeletedEvent({
                key: keyEntity.key
            })
            await prismaRabbitmqOutbox.publish(keyDeletedEvent)
        })
    }
}

export namespace DeleteKeyUsecase {
    export type Input = {
        key: string
    }
}