import { PrismaClient } from "@prisma/client/scripts/default-index";
import { BaseEvent } from "../../base";

export class PrismaEventSourcingProvider {

    constructor(
        private readonly prismaClient: PrismaClient
    ) {}

    async insertEvent(event: BaseEvent.Schema) {
        await this.prismaClient.eventSourcing.create({
            data: {
                ...event,
                payload: JSON.stringify(event.payload)
            }
        })
    }

}

export namespace PrismaEventSourcingProvider {

}