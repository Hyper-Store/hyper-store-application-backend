import { UserSessionFacade } from "src/modules/user-session/facades";
import { InvalidRefreshTokenError } from "./errors";
import { PrismaClient } from "@prisma/client";

export class RefreshTokenUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute(input: RefreshTokenUsecase.Input) {
        const userSessionFacade = new UserSessionFacade(this.prismaClient)
        const result = await userSessionFacade.revalidateSession(input)
        if(result === "UserSessionNotFoundError") throw new InvalidRefreshTokenError()
        return { 
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        };
    }
}

export namespace RefreshTokenUsecase {
    export type Input = {
        refreshToken: string
        ip: string
        userAgent: string
    }
}