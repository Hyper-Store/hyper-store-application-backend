import { JwtGateway } from "../../gateways";
import { InvalidRefreshTokenError } from "./errors";

export class RefreshTokenUsecase {

    async execute({ refreshToken }: RefreshTokenUsecase.Input) {
        const result = await JwtGateway.generateAccessTokenFromRefreshToken(refreshToken)
        if(!result) throw new InvalidRefreshTokenError()

        return { 
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        };
    }
}

export namespace RefreshTokenUsecase {
    export type Input = {
        refreshToken: string
    }
}