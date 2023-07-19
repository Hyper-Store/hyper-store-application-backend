import { PrismaService } from "src/infra/prisma/prisma.service"
import { PrismaIdpotenceConsumer } from "../providers"
import { PrismaClient } from "@prisma/client"

export class PrismaIdpotenceConsumerService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async consume(
        eventId: string,
        consumerName: string,
        callback: (session: PrismaClient) => Promise<any>
    ): Promise<any> {


        return await this.prismaService.$transaction(async (prisma: PrismaClient) => {

            const prismaIdpotenceConsumer = new PrismaIdpotenceConsumer(prisma)
            const isEventRegistered = await prismaIdpotenceConsumer.isEventRegistered(eventId, consumerName)
            if(isEventRegistered) return
    
            const result = await callback(prisma)
            await prismaIdpotenceConsumer.registerEvent(eventId, consumerName)
            return result
        })

    }
}
