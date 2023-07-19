import { PrismaClient } from "@prisma/client";
import { StockEntity } from "../entities";


export class PrismaStockRepository {

    constructor(
        private readonly prisma: PrismaClient
    ){}
    
    async create(stockEntity: StockEntity) {
        await this.prisma.stock.create({
            data: stockEntity.toJSON(),

        })
    }

    async takeOneFromStock(stockType: string): Promise<StockEntity | null>{
        const stock = await this.prisma.stock.findFirst({
            where: { type: stockType, }
        })
        if(!stock) return null
        const stockEntity = StockEntity.create(stock, stock.id)

        return stockEntity
    }

    async findById(id: string): Promise<StockEntity | null> {
        const stock = await this.prisma.stock.findFirst({
            where: { id }
        })
        if(!stock) return null

        return StockEntity.create(stock, stock.id)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.stock.delete({
            where: { id }
        })
    }
}