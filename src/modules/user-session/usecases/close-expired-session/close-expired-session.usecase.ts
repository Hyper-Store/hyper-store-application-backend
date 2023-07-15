import { PrismaClient } from "@prisma/client";
import { PrismaUserSessionRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { SessionClosedEvent } from "./session-closed.event";
import { Either, failure, success } from "src/modules/@shared/logic";

export class CloseExpiredUserSessionUseCase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: CloseExpiredUserSessionUseCase.Input): Promise<Either<CloseExpiredUserSessionUseCase.Errors, null>> {

        return await this.prismaClient.$transaction(async (prisma: PrismaClient): Promise<Either<CloseExpiredUserSessionUseCase.Errors, null>> => {
            const prismaUserSessionRepository = new PrismaUserSessionRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const userSessionEntity = await prismaUserSessionRepository.findById(input.userSessionId)
            if(!userSessionEntity) return failure("UserSessionNotFoundError")
            
            if(!userSessionEntity.refreshToken.isExpired()) return failure("SessionIsNotExpiredError")
        
            await prismaUserSessionRepository.delete(userSessionEntity.id)

            const sessionClosedEvent = new SessionClosedEvent({ userSessionId: userSessionEntity.id })
            await prismaRabbitmqOutbox.publish(sessionClosedEvent)

            return success(null)
        })

    }
}

export namespace CloseExpiredUserSessionUseCase {

    export type Errors = "UserSessionNotFoundError" | "SessionIsNotExpiredError"

    export type Input = {
        userSessionId: string
    }
}