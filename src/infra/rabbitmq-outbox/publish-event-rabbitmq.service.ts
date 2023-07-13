import { Injectable } from "@nestjs/common"
import { OutboxRecord } from "./interface"
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { PrismaService } from "src/prisma/prisma.service"
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"


@Injectable()
export class PublishEventRabbitmqService {

    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly prismaService: PrismaService,
    ){}

    async publish(event: OutboxRecord) {
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaService)
        const eventSchemaData = JSON.parse(event.eventSchemaData)
        try {
            await this.amqpConnection.publish(event.topic, event.eventName, eventSchemaData)
            await this.amqpConnection.publish("eventSourcing", "", eventSchemaData) 
            await prismaRabbitmqOutbox.remove(event.id)
        }catch(err) {
            await prismaRabbitmqOutbox.addRetryCount(event.id)
            await prismaRabbitmqOutbox.addErrorLog(event.id, { 
                errorMessage: err.message, 
                stack: err.stack
            })
        }
    }
}