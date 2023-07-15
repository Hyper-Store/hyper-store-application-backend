import { PrismaClient } from "@prisma/client";
import { PrismaUserSessionRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { SessionClosedEvent } from "./session-closed.event";
import { UserSessionNotFoundError } from "../_errors";

export class CloseSessionUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: CloseSessionUsecase.Input): Promise<void> {

        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaUserSessionRepository = new PrismaUserSessionRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const userSessionEntity = await prismaUserSessionRepository.findById(input.userSessionId)
            if(!userSessionEntity) throw new UserSessionNotFoundError()
            
            await prismaUserSessionRepository.delete(userSessionEntity.id)

            const sessionClosedEvent = new SessionClosedEvent({ userSessionId: userSessionEntity.id })
            await prismaRabbitmqOutbox.publish(sessionClosedEvent)
        })

    }
}

export namespace CloseSessionUsecase {


    export type Input = {
        userSessionId: string
    }
}