import { PrismaClient } from "@prisma/client";


export class PrismaIdpotenceConsumer {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async registerEvent(eventId: string, consumerName: string){
        await this.prismaClient.idpotenceConsumer.create({
            data: {
                consumerName,
                eventId
            }
        })
    }

    async isEventRegistered(eventId: string, consumerName: string): Promise<boolean>{
        const event = await this.prismaClient.idpotenceConsumer.findFirst({
            where: {
                consumerName,
                eventId
            }
        })
        return !!event
    }
}

export namespace PrismaIdpotenceConsumer {

 
}