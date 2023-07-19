import { PrismaClient } from "@prisma/client";
import { StockRedemptionEntity } from "../entities";


export class PrismaStockRedemptionRepository {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async create(stockRedemptionEntity: StockRedemptionEntity): Promise<void> {
        await this.prismaClient.stockRedemption.create({
            data: stockRedemptionEntity.toJSON()
        })
    }

    async getRedemptionCount(userId: string, signatureId: string): Promise<number>{

    }
}