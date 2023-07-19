import { PrismaClient } from "@prisma/client"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"
import { PrismaStockRedemptionRepository } from "../../repositories"
import {  StockRedeemedEvent } from "./stock-redeemed.event"
import { StockRedemptionEntity } from "../../entities"
import { StockFacade } from "src/modules/stock/facades"
import { SignatureFacade } from "src/modules/signatures/facades"
import { OutOfStockError, ServiceTypeNotAccounceGeneratorError, SignatureNotFoundError } from "../_errors"


export class RedeemStockUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ userId, signatureId }: RedeemStockUsecase.Input) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
  
            const signatureFacade = new SignatureFacade(prisma)
            const stockFacade = new StockFacade(prisma)
            const prismaStockRedemptionRepository = new PrismaStockRedemptionRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
            
            const signature = await signatureFacade.getSignatureDetails(signatureId)
            if(!signature) throw new SignatureNotFoundError()
            
            if(signature.service.type !== "ACCOUNT_GENERATOR") throw new ServiceTypeNotAccounceGeneratorError()

            const stock = await stockFacade.takeOneFromStock(signature.service.id)
            if(!stock) throw new OutOfStockError()

            const stockRedemptionEntity = StockRedemptionEntity.create({
                signatureId: signature.id,
                stockId: stock.id,
                userId
            })

            await prismaStockRedemptionRepository.create(stockRedemptionEntity)

            const stockRedeemedEvent = new StockRedeemedEvent(stockRedemptionEntity.toJSON())
            await prismaRabbitmqOutbox.publish(stockRedeemedEvent)
    
        })
    }


}

export namespace RedeemStockUsecase {
    
    export type Input = {
        userId: string
        signatureId: string

    }
}