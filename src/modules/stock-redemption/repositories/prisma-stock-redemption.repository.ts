import { PrismaClient } from "@prisma/client";
import { StockRedemptionEntity } from "../entities";
import { startOfDay, endOfDay } from 'date-fns';

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
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        return await this.prismaClient.stockRedemption.count({
            where: {
                userId,
                signatureId,
                dateTimeRedeemed: {
                    gte: todayStart,
                    lte: todayEnd,
                }
            }
        })
    }
}