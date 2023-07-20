import { PrismaClient } from "@prisma/client";
import { RedeemKeyDto } from "../../dto/redeem-key.dto";
import { PrismaKeyRepository } from "../../respositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { KeyNotFoundError } from "../_errors";
import {  KeyNotActivatedError, ServiceIsInMaintenanceError, SignatureAlreadyActiveError } from "./errors";
import { KeyRedeemedEvent } from "./key-redeemed.event";
import { SignatureFacade } from "src/modules/signatures/facades";
import { ServiceFacade } from "src/modules/services/facades";


export class RedeemKeyUsecase {


    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ key, keyRedeemerId }: RedeemKeyDto) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaKeyRepository = new PrismaKeyRepository(prisma)
            const signatureFacade = new SignatureFacade(prisma)
            const serviceFacade = new ServiceFacade(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            
            const keyEntity = await prismaKeyRepository.findByKey(key)
            if(!keyEntity) throw new KeyNotFoundError()
            
            if(!keyEntity.isActivated()) throw new KeyNotActivatedError()
            keyEntity.redeem(keyRedeemerId)
            
            const signatureAlreadyActive = await signatureFacade.isSignatureActive(keyRedeemerId, keyEntity.serviceId)            
            if(signatureAlreadyActive) throw new SignatureAlreadyActiveError()

            const serviceInMaintenance = await serviceFacade.isServiceInMaintenance(keyEntity.serviceId)
            if(serviceInMaintenance) throw new ServiceIsInMaintenanceError()

            await prismaKeyRepository.update(keyEntity)
            
            const keyGeneratedEvent = new KeyRedeemedEvent({
                key: keyEntity.key,
                keyRedeemerId: keyRedeemerId
            })
            await prismaRabbitmqOutbox.publish(keyGeneratedEvent)

            return;
        })
    }
}