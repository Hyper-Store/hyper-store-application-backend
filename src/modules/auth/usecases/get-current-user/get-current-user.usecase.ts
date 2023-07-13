import { JwtGateway } from "../../gateways"
import { InvalidAccessTokenError } from "./errors"

export class GetCurrentUserUsecase {

    async execute({ accessToken }: GetCurrentUserUsecase.Input) {
        const verifyTokenResult = await JwtGateway.verifyAccessToken(accessToken)
        if(!verifyTokenResult) throw new InvalidAccessTokenError()
        return verifyTokenResult
    }
}

export namespace GetCurrentUserUsecase {
    export type Input = {
        accessToken: string
    }
}