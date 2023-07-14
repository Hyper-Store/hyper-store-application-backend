import { PrismaClient, UserSession } from "@prisma/client";
import { AccessTokenValueObject, RefreshTokenValueObject, UserSessionEntity } from "../entities";

class PrismaUserEntityMapper {
    static toDomain(prismaUserSession: UserSession): UserSessionEntity {
        const accessTokenValueObject = new AccessTokenValueObject({
            accessToken: prismaUserSession.accessToken,
            expirationDateTime: prismaUserSession.acessTokenExpirationDateTime
        })
        const refreshTokenValueObject = new RefreshTokenValueObject({
            refreshToken: prismaUserSession.refreshToken,
            expirationDateTime: prismaUserSession.refreshTokenExpirationDateTime
        })
        const userSessionEntity = UserSessionEntity.create({
            ...prismaUserSession,
            accessToken: accessTokenValueObject,
            refreshToken: refreshTokenValueObject,
        }, prismaUserSession.id)
        if(prismaUserSession.status === "ACCESS_TOKEN_EXPIRED") userSessionEntity.expireSession()
        return userSessionEntity
    }
}

export class PrismaUserSessionRepository {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}


    async create(userSessionEntity: UserSessionEntity): Promise<void> {
        const { accessToken, refreshToken, ...props} = userSessionEntity.toJSON()
        await this.prismaClient.userSession.create({
            data: {
                ...props,
                accessToken: accessToken.accessToken,
                acessTokenExpirationDateTime: accessToken.expirationDateTime,
                refreshToken: refreshToken.refreshToken,
                refreshTokenExpirationDateTime: refreshToken.expirationDateTime
            }
        })
    }

    async findById(id: string): Promise<UserSessionEntity | null> {
        const prismaUserSession = await this.prismaClient.userSession.findUnique({
            where: { id }
        })
        if(!prismaUserSession) return null
        return PrismaUserEntityMapper.toDomain(prismaUserSession)
    }

    async findByRefreshToken(refreshToken: string): Promise<UserSessionEntity | null> {
        const prismaUserSession = await this.prismaClient.userSession.findFirst({
            where: { refreshToken: refreshToken ?? "" }
        })
        if(!prismaUserSession) return null
        return PrismaUserEntityMapper.toDomain(prismaUserSession)
    }

    async findByAccessToken(accessToken: string): Promise<UserSessionEntity | null> {
        const prismaUserSession = await this.prismaClient.userSession.findFirst({
            where: { accessToken: accessToken ?? ""}
        })
        if(!prismaUserSession) return null
        return PrismaUserEntityMapper.toDomain(prismaUserSession)
    }
}