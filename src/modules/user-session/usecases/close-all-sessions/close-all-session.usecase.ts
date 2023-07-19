import { PrismaClient } from "@prisma/client";
import { PrismaUserSessionRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { AllSessionsClosedEvent } from "./all-sessions-closed.event";

export class CloseAllSessionsUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ userId }: CloseAllSessionsUsecase.Input): Promise<void> {

        const prismaUserSessionRepository = new PrismaUserSessionRepository(this.prismaClient)
        const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)

        await prismaUserSessionRepository.deleteAll(userId)

        const allSessionsClosedEvent = new AllSessionsClosedEvent({ userId })
        await prismaRabbitmqOutbox.publish(allSessionsClosedEvent)
    }
}

export namespace CloseAllSessionsUsecase {


    export type Input = {
        userId: string
    }
}