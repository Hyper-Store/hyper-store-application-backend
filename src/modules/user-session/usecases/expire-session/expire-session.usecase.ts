import { PrismaClient } from "@prisma/client";
import { PrismaUserSessionRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { AccessTokenValueObject, RefreshTokenValueObject, UserSessionEntity } from "../../entities";
import { SessionExpiredEvent } from "./session-expired.event";
import { Either, failure, success } from "src/modules/@shared/logic";

export class ExpireSessionUseCase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: ExpireSessionUseCase.Input): Promise<Either<ExpireSessionUseCase.Errors, null>> {

        return await this.prismaClient.$transaction(async (prismaClient) => {
            const prismaUserSessionRepository = new PrismaUserSessionRepository(this.prismaClient)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(this.prismaClient)
    
            const userSessionEntity = await prismaUserSessionRepository.findById(input.userSessionId)
            if(!userSessionEntity) return failure("UserSessionNotFoundError")
    
            if(!userSessionEntity.accessToken.isExpired()) return failure("SessionIsNotExpiredError")
            userSessionEntity.expireSession()

            const sessionExpiredEvent = new SessionExpiredEvent({ userSessionId: userSessionEntity.id })
            await prismaRabbitmqOutbox.publish(sessionExpiredEvent)

            return success(null)
        })

    }
}

export namespace ExpireSessionUseCase {

    export type Errors = "UserSessionNotFoundError" | "SessionIsNotExpiredError"

    export type Input = {
        userSessionId: string
    }
}