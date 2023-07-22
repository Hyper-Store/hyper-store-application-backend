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

    async findLastByUserId(userId: string): Promise<UserSessionEntity | null> {
        const prismaUserSession = await this.prismaClient.userSession.findFirst({
            where: { userId: userId ?? "" },
            orderBy: { dateTimeCreated: "desc" }
        })
        if(!prismaUserSession) return null
        return PrismaUserEntityMapper.toDomain(prismaUserSession)
    }

    async findById(id: string): Promise<UserSessionEntity | null> {
        const prismaUserSession = await this.prismaClient.userSession.findUnique({
            where: { id: id ?? "" }
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

    async deleteAll(userId: string): Promise<void> {
        await this.prismaClient.userSession.deleteMany({
            where: { userId: userId ?? "" }
        })
    }

    async update(userSessionEntity: UserSessionEntity): Promise<void> {
        const { accessToken, refreshToken, id, userId,...props} = userSessionEntity.toJSON()
        await this.prismaClient.userSession.update({
            where: { id: id ?? "" },
            data: {
                ...props,
                accessToken: accessToken.accessToken,
                acessTokenExpirationDateTime: accessToken.expirationDateTime,
                refreshToken: refreshToken.refreshToken,
                refreshTokenExpirationDateTime: refreshToken.expirationDateTime
            }
        })
    }

    async delete(id: string): Promise<void> {
        await this.prismaClient.userSession.delete({
            where: { id: id ?? "" }
        })
    }
}