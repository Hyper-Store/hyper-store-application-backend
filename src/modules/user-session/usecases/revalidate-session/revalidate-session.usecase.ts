import { PrismaClient } from "@prisma/client";
import { PrismaUserSessionRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import {  SessionRevalidatedEvent } from "./session-revalidated.event";
import { Either, failure, success } from "src/modules/@shared/logic";
import { AccessTokenValueObject, RefreshTokenValueObject } from "../../entities";
import { JwtGateway } from "../../gateways";

export class RevalidateSessionUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: RevalidateSessionUsecase.Input): Promise<Either<RevalidateSessionUsecase.Errors, JwtGateway.Tokens>> {
        return await this.prismaClient.$transaction(async (prisma: PrismaClient): Promise<Either<RevalidateSessionUsecase.Errors, JwtGateway.Tokens>> => {
            const prismaUserSessionRepository = new PrismaUserSessionRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const userSessionEntity = await prismaUserSessionRepository.findByRefreshToken(input.refreshToken)
            if(!userSessionEntity) return failure("UserSessionNotFoundError")
    
            const userPayload: JwtGateway.JwtModel = { userId: userSessionEntity.userId }
            const { accessToken, expirationDateTime: accessTokenExpiration } = await JwtGateway.generateAccessToken(userPayload)
            const { refreshToken, expirationDateTime: refreshTokenExpiration } = await JwtGateway.generateRefreshToken(userPayload)
    
            const accessTokenValueObject = new AccessTokenValueObject({
                accessToken,
                expirationDateTime: accessTokenExpiration
            })
            const refreshTokenValueObject = new RefreshTokenValueObject({
                refreshToken: refreshToken,
                expirationDateTime: refreshTokenExpiration
            })

            userSessionEntity.update({
                refreshToken: refreshTokenValueObject,
                accessToken: accessTokenValueObject,
                ip: input.ip,
                userAgent: input.userAgent
            })

            await prismaUserSessionRepository.update(userSessionEntity)

            const sessionRevalidatedEvent = new SessionRevalidatedEvent(userSessionEntity.toJSON())
            await prismaRabbitmqOutbox.publish(sessionRevalidatedEvent)

            return success({ 
                accessToken: accessTokenValueObject.accessToken,
                refreshToken: refreshTokenValueObject.refreshToken
             })
        })

    }
}

export namespace RevalidateSessionUsecase {

    export type Errors = "UserSessionNotFoundError" 

    export type Input = {
        refreshToken: string
        ip: string
        userAgent: string
    }
}