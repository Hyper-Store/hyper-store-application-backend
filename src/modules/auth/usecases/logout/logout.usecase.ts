import { UserSessionFacade } from "src/modules/user-session/facades";
import { PrismaClient } from "@prisma/client";
import { InvalidAccessTokenError } from "../_errors";

export class LogoutUsecase {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ accessToken }: LogoutUsecase.Input) {
        const userSessionFacade = new UserSessionFacade(this.prismaClient)
        const session = await userSessionFacade.getSessionByAccessToken(accessToken)
        if(!session) throw new InvalidAccessTokenError()
        await userSessionFacade.deleteSessionByAccessToken(accessToken)
    }
}

export namespace LogoutUsecase {
    export type Input = {
        accessToken: string
    }
}