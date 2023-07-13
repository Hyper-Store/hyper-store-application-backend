import { PrismaClient } from "@prisma/client";
import { RedeemKeyDto } from "../../dto/redeem-key.dto";
import { PrismaKeyRepository } from "../../respositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { KeyNotFoundError } from "../errors";
import { KeyAlreadyRedeemedError } from "./errors";
import { KeyRedeemedEvent } from "./key-redeemed.event";


export class RedeemKeyUsecase {


    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ key, keyRedeemerId }: RedeemKeyDto) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaKeyRepository = new PrismaKeyRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

            const keyEntity = await prismaKeyRepository.findByKey(key)
            if(!keyEntity) throw new KeyNotFoundError()
         
            if(keyEntity.isRedeemed()) throw new KeyAlreadyRedeemedError()
            keyEntity.redeem(keyRedeemerId)

            await prismaKeyRepository.update(keyEntity)
            
            const keyGeneratedEvent = new KeyRedeemedEvent({
                keyId: keyEntity.id,
                keyRedeemerId: keyRedeemerId
            })
            await prismaRabbitmqOutbox.publish(keyGeneratedEvent)

            return;
        })
    }
}