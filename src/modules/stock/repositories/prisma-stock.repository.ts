import { PrismaClient } from "@prisma/client";
import { StockEntity } from "../entities";


export class PrismaStockRepository {

    constructor(
        private readonly prisma: PrismaClient
    ){}
    
    async create(stockEntity: StockEntity) {
        await this.prisma.stock.create({
            data: stockEntity.toJSON()
        })
    }

    async findById(id: string): Promise<StockEntity | null> {
        const stock = await this.prisma.stock.findUnique({
            where: { id }
        })
        if(!stock) return null

        return StockEntity.create(stock, stock.id)
    }
}