import { AmqpConnection, Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BaseEvent } from 'src/modules/@shared';
import { PrismaEventSourcingProvider, PrismaIdpotenceConsumer } from 'src/modules/@shared/providers';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class PrismaEventSourcingService implements OnModuleInit {

    static consumerName = "prisma-event-sourcing-queue"
    static retryConsumerName = "retry-prisma-event-sourcing"

    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly prismaService: PrismaService,
    ){}

    @RabbitRPC({
        exchange: 'eventSourcing',
        routingKey: "",
        queue:  PrismaEventSourcingService.consumerName,
        queueOptions: {
            deadLetterExchange: "",
            deadLetterRoutingKey: PrismaEventSourcingService.retryConsumerName
        }
      })
    public async consumer(msg: BaseEvent.Schema) {
        if(msg.persistEvent === false) return
        try{
            await this.prismaService.$transaction(async (prisma: PrismaClient) => {
                const prismaEventSourcingProvider = new PrismaEventSourcingProvider(prisma)
                const prismaIdpotenceConsumer = new PrismaIdpotenceConsumer(prisma)
                
                const isEventRegistered = await prismaIdpotenceConsumer.isEventRegistered(msg.id, PrismaEventSourcingService.consumerName)
                if(isEventRegistered) return
    
                await prismaEventSourcingProvider.insertEvent(msg)
                await prismaIdpotenceConsumer.registerEvent(msg.id, PrismaEventSourcingService.consumerName)
            })
        }catch(err){
            return new Nack()
        }
    }

    async onModuleInit() {
        this.assertRetryQueue()
    }

    assertRetryQueue() {
        this.amqpConnection.channel.assertQueue(PrismaEventSourcingService.retryConsumerName, { 
            durable: true,
            deadLetterExchange: "",
            deadLetterRoutingKey: PrismaEventSourcingService.consumerName,
            messageTtl: 1000 // 1 second
        })
    }
}
