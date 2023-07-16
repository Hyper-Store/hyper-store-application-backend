import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto"
import { BaseEvent } from "src/modules/@shared";

@Injectable()
export class RabbitmqService {

    constructor(
        private readonly amqpConnection: AmqpConnection
    ) { }

    async setupTemporaryConsumer(
        exchange: string, 
        routingKey: string, 
        callback: (message: any | BaseEvent.Schema) => void
    ): Promise<RabbitmqService.TemporaryConsumerResponse> {
        const queueName = `temporary-queue-${randomUUID()}`
        await this.amqpConnection.channel.assertQueue(queueName, { exclusive: true, autoDelete: true })
        await this.amqpConnection.channel.bindQueue(queueName, exchange, routingKey)
        const consumer = await this.amqpConnection.channel.consume(queueName, (message) => {
            callback(message)
        }, { noAck: true })
        return { consumerTag: consumer.consumerTag }
    }

    async cancelTemporaryConsumer(consumerTag: string) {
        await this.amqpConnection.channel.cancel(consumerTag)
    }

}

export namespace RabbitmqService {

    export type TemporaryConsumerResponse = {
        consumerTag: string
    }
}