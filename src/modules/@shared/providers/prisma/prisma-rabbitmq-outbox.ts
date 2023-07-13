import { PrismaClient } from "@prisma/client";
import { BaseEvent } from "../../base";
import { OutboxRecord } from "src/infra/rabbitmq-outbox/interface";

export class PrismaRabbitmqOutbox {

    constructor(
        private readonly prismaClient: PrismaClient,
    ){}

    async publish(event: BaseEvent): Promise<void> {
        await this.prismaClient.prismaRabbitmqOutbox.create({
            data: {
                ...event.format(),
                payload: JSON.stringify(event.payload),
                eventSchemaData: JSON.stringify(event.format())
            }
        })
    }

    async remove(id: string): Promise<void> {
        await this.prismaClient.prismaRabbitmqOutbox.deleteMany({
            where: {
                id
            }
        })
    }

    async getAllFailedEvents(): Promise<OutboxRecord[]> {
        const secondsAgo = new Date(Date.now() - 1000); // current time minus one second
        const events = await this.prismaClient.prismaRabbitmqOutbox.findMany({
            where: {
                dateTimeOccurred: {
                    lt: secondsAgo
                }
            }
        })
        return events
    }

    async addRetryCount(id: string): Promise<void> {
        await this.prismaClient.prismaRabbitmqOutbox.updateMany({
            where: { id },
            data: {
                retry_count: {
                    increment: 1
                }
            }
        })
    }

    async addErrorLog(id: string, errorMessage: Object): Promise<void> {
        await  this.prismaClient.prismaRabbitmqOutbox.updateMany({
            where: { id },
            data: {
                error_message: JSON.stringify(errorMessage)
            }
        })
    }
}