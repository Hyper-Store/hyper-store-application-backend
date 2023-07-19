import { PrismaClient } from "@prisma/client"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"
import { PrismaStockRepository } from "../../repositories"
import { StockCreatedEvent } from "./stock-created.event"
import { StockEntity } from "../../entities"


export class CreateStockUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ stocks }: CreateStockUsecase.Input) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            for(const stock of stocks) {
                const prismaStockRepository = new PrismaStockRepository(prisma)
                const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
                
                const stockEntity = StockEntity.create(stock)
    
                await prismaStockRepository.create(stockEntity)
    
                const stockCreatedEvent = new StockCreatedEvent(stockEntity.toJSON())
                await prismaRabbitmqOutbox.publish(stockCreatedEvent)
            }

        })
    }


}

export namespace CreateStockUsecase {
    
    export type Stock = {
        value: string
        type: string
    }

    export type Input = {
        stocks: Stock[]
    }
}