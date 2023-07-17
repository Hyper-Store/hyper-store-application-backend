import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Either, failure, success } from "src/modules/@shared/logic";
import { AuthFacade } from "src/modules/auth/facade";
import { UserSessionFacade } from "src/modules/user-session/facades";
import { JwtGateway } from "src/modules/user-session/gateways";
import { PrismaService } from "src/prisma/prisma.service";

export class AccessTokenValidationService {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}
    
    async validate(accessToken: string): Promise<AccessTokenValidationService.Output>{

        const userSessionFacade = new UserSessionFacade(this.prismaClient) 
        const user = await userSessionFacade.verifyAccessToken(accessToken)
        if(!user) return failure("InvalidAccessTokenError")

        const authFacade = new AuthFacade(this.prismaClient)
        const isUserBanned = await authFacade.isUserBanned(user.userId)
        if(isUserBanned) return failure("UserBannedError")

        return success(user)
    }

    

}

export namespace AccessTokenValidationService {

    export type Errors = "InvalidAccessTokenError" | "UserBannedError"

    export type Output = Either<Errors, JwtGateway.JwtModel>
}