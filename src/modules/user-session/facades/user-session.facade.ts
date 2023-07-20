import { PrismaClient } from "@prisma/client";
import { JwtGateway } from "../gateways";
import { PrismaUserSessionRepository } from "../repositories";
import { CreateSessionUsecase, RevalidateSessionUsecase } from "../usecases";

export class UserSessionFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async verifyAccessToken(accessToken: string): Promise<JwtGateway.JwtModel | null> {
        const prismaUserSessionRepository = new PrismaUserSessionRepository(this.prismaClient)
        
        const payload = await JwtGateway.verifyAccessToken(accessToken)
        if(!payload) return null

        const userSessionEntity = await prismaUserSessionRepository.findByAccessToken(accessToken)
        if(!userSessionEntity) return null

        return payload
    }

    async createSession(input: CreateSessionUsecase.Input): Promise<JwtGateway.Tokens> {
        const createSessionUsecase = new CreateSessionUsecase(this.prismaClient)
        return await createSessionUsecase.execute(input)
    }

    async getSessionByAccessToken(accessToken: string): Promise<{ sessionId: string } | null>{
        const prismaUserSessionRepository = new PrismaUserSessionRepository(this.prismaClient)
        const userSessionEntity = await prismaUserSessionRepository.findByAccessToken(accessToken)
        if(!userSessionEntity) return null
        return { sessionId: userSessionEntity.id }
    }

    async deleteSessionByAccessToken(accessToken: string): Promise<void> {
        const prismaUserSessionRepository = new PrismaUserSessionRepository(this.prismaClient)
        const userSessionEntity = await prismaUserSessionRepository.findByAccessToken(accessToken)
        if(!userSessionEntity) return
        await prismaUserSessionRepository.delete(userSessionEntity.id)
    }

    async revalidateSession(input: RevalidateSessionUsecase.Input): Promise<JwtGateway.Tokens | RevalidateSessionUsecase.Errors> {
        const revalidateSessionUsecase = new RevalidateSessionUsecase(this.prismaClient)
        const result = await revalidateSessionUsecase.execute(input)
        if(result.isFailure()) return result.value
        return result.value
    }   
}