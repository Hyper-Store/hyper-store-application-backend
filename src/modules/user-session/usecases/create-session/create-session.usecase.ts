import { PrismaClient } from "@prisma/client";
import { PrismaUserSessionRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { AccessTokenValueObject, RefreshTokenValueObject, UserSessionEntity } from "../../entities";
import { SessionCreatedEvent } from "./session-create.event";
import { JwtGateway } from "../../gateways";


export class CreateSessionUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: CreateSessionUsecase.Input) {

        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaUserSessionRepository = new PrismaUserSessionRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)
    
            const userPayload: JwtGateway.JwtModel = { userId: input.userId }
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
            const userSessionEntity = UserSessionEntity.create({
                ...input,
                accessToken: accessTokenValueObject,
                refreshToken: refreshTokenValueObject,
            })
    
            await prismaUserSessionRepository.create(userSessionEntity)
    
            const sessionCreatedEvent = new SessionCreatedEvent(userSessionEntity.toJSON())
            await prismaRabbitmqOutbox.publish(sessionCreatedEvent)

            return { accessToken, refreshToken }
        })

    }
}

export namespace CreateSessionUsecase {
    export type Input = {
        userId: string
        ip: string
        userAgent: string
    }
}