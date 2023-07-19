import { PrismaClient } from "@prisma/client"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"
import { PrismaStockRepository } from "../../repositories"
import { StockCreatedEvent } from "./stock-created.event"
import { StockEntity } from "../../entities"
import { ServiceFacade } from "src/modules/services/facades"
import { ServiceNotFoundError } from "./_errors"


export class CreateStockUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ stocks }: CreateStockUsecase.Input) {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            for(const stock of stocks) {
                const prismaStockRepository = new PrismaStockRepository(prisma)
                const serviceFacade = new ServiceFacade(prisma)
                const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

                const serviceExists = await serviceFacade.serviceExists(stock.serviceId)
                if(!serviceExists) throw new ServiceNotFoundError()

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
        serviceId: string
    }

    export type Input = {
        stocks: Stock[]
    }
}