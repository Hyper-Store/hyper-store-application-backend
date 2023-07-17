import { AmqpConnection, Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import { BaseEvent } from 'src/modules/@shared';
import { MongoEventSourcingProvider, MongoIdpotenceConsumer } from 'src/modules/@shared/providers';

@Injectable()
export class MongoEventSourcingService implements OnModuleInit {

    static consumerName = "mongo-event-sourcing-queue"
    static retryConsumerName = "retry-mongo-event-sourcing"

    constructor(
        private readonly amqpConnection: AmqpConnection,
    ){}

    @RabbitRPC({
        exchange: 'eventSourcing',
        routingKey: "",
        queue:  MongoEventSourcingService.consumerName,
        queueOptions: {
            deadLetterExchange: "",
            deadLetterRoutingKey: MongoEventSourcingService.retryConsumerName
        }
    })
    public async consumer(msg: BaseEvent.Schema) {
        if(msg.persistEvent === false) return
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const mongoEventSourcingProvider = new MongoEventSourcingProvider(session)
            const mongoIdpotenceConsumer = new MongoIdpotenceConsumer(session)
            
            const isEventRegistered = await mongoIdpotenceConsumer.isEventRegistered(msg.id, MongoEventSourcingService.consumerName)
            if(isEventRegistered) return
    
            await mongoEventSourcingProvider.insertEvent(msg)
            await mongoIdpotenceConsumer.registerEvent(msg.id, MongoEventSourcingService.consumerName)
            
            await session.commitTransaction();
        }catch(err){
            await session.abortTransaction();
            await session.endSession();
            return new Nack()
        }finally {
            await session.endSession();
        }
    }

    async onModuleInit() {
        this.assertRetryQueue()
    }

    assertRetryQueue() {
        this.amqpConnection.channel.assertQueue(MongoEventSourcingService.retryConsumerName, { 
            durable: true,
            deadLetterExchange: "",
            deadLetterRoutingKey: MongoEventSourcingService.consumerName,
            messageTtl: 1000 // 1 second
        })
    }

}
