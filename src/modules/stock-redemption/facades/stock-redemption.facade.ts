import { PrismaClient } from "@prisma/client";
import { Either, failure, success } from "src/modules/@shared/logic";
import { SignatureFacade } from "src/modules/signatures/facades";
import { StockFacade } from "src/modules/stock/facades";
import { PrismaStockRedemptionRepository } from "../repositories";

export class StockRedemptionFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}


    async getTodayStockRedemptionInfo(userId: string, signatureId: string): Promise<StockRedemptionFacade.Output>{
        const signatureFacade = new SignatureFacade(this.prismaClient)
        const prismaStockRedemptionRepository = new PrismaStockRedemptionRepository(this.prismaClient)
        const signature = await signatureFacade.getSignatureDetails(signatureId)
        if(!signature) return failure("SignatureNotFoundError")
        if(signature.userId !== userId) return failure("SignatureNotFromUserError")

        const todayRedemptionCount = await prismaStockRedemptionRepository.getTodayRedemptionCount(userId, signatureId) 
        return success({
            todayRedemptionCount,
            quantityPerDay: signature.quantityPerDay
        })

    }
}

export namespace StockRedemptionFacade {
        
    export type GetTodayStockRedemptionInfoOutput = {
        todayRedemptionCount: number
        quantityPerDay: number
    }

    export type Output = Either<
        "SignatureNotFromUserError" | "SignatureNotFoundError", 
        GetTodayStockRedemptionInfoOutput
    >
}