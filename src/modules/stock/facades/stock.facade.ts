import { PrismaClient } from "@prisma/client";
import { StockEntity } from "../entities";
import { PrismaStockRepository } from "../repositories";


export class StockFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async takeOneFromStock(stockType: string): Promise<StockEntity.PropsJSON | null> {
        const prismaStockRepository = new PrismaStockRepository(this.prismaClient)
        const stockEntity = await prismaStockRepository.takeOneFromStock(stockType)
        if(!stockEntity) return null
        await prismaStockRepository.delete(stockEntity.id)
        return stockEntity.toJSON()
    }
}

export namespace StockFacade {

}