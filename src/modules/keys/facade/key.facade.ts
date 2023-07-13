import { PrismaClient } from "@prisma/client";
import { PrismaKeyRepository } from "../respositories";

export class KeyFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async consultKeyDetails(key: string): Promise<KeyFacade.KeyDetails | null> {
        const prismaKeyRepository = new PrismaKeyRepository(this.prismaClient)
        const keyEntity = await prismaKeyRepository.findByKey(key)
        if(!keyEntity) return null
        return {
            ...keyEntity.toJSON(),
            isRedeemed: keyEntity.isRedeemed()
        }
    }
}

export namespace KeyFacade {

    export type KeyDetails = {
        id: string
        key: string
        serviceId: string
        validUntil: number
        keyRedeemerId?: string
        isRedeemed: boolean
    }
}

