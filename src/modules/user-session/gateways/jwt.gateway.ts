import * as jwt from "jsonwebtoken"
import { Either, failure, success } from "src/modules/@shared/logic"

export class JwtGateway {


    static async generateAccessToken({  userId }: JwtGateway.JwtModel): Promise<JwtGateway.GenerateAcessTokenResult> {
        const minutesToExpire = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME_IN_MINUTES)
        const expirationDateTime = new Date()
        expirationDateTime.setMinutes(expirationDateTime.getMinutes() + minutesToExpire)

        const accessToken = jwt.sign({
            userId,
            createdAt: new Date()
        }, 
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: `${minutesToExpire}m` }
        )
        return { accessToken, expirationDateTime }
    }

    static async generateRefreshToken({ userId }: JwtGateway.JwtModel): Promise<JwtGateway.GenerateRefreshTokenResult> {
        const daysToExpire = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS)
        const expirationDateTime = new Date()
        expirationDateTime.setDate(expirationDateTime.getDate() + daysToExpire)

        const refreshToken = jwt.sign({
            userId,
            createdAt: new Date()
        }, 
        process.env.JWT_REFRESH_TOKEN_SECRET, 
        { expiresIn: `${daysToExpire}d` } )
        return { refreshToken, expirationDateTime }
    }

    static async verifyAccessToken(token: string): Promise<JwtGateway.JwtModel | null> {
        try {
            const {  userId } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtGateway.JwtModel
            return {  userId }
        }catch {
            return null
        }
    }

    static async verifyRefreshToken(refreshToken: string): Promise<JwtGateway.JwtModel | null> {
        try {
            const {  userId }  = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET) as JwtGateway.JwtModel            
            return { userId } 
        } catch (error) {
            return null
        }
    }

    static async generateAccessTokenFromRefreshToken(refreshToken: string): Promise<Either<string, JwtGateway.GenerateAccessTokenFromRefreshTokenResult>> {
        const verifyTokenResult = await JwtGateway.verifyRefreshToken(refreshToken)
        if(!verifyTokenResult) return failure("InvalidRefreshTokenError")
        
        const newAccessToken = await JwtGateway.generateAccessToken(verifyTokenResult)
        const newRefreshToken = await JwtGateway.generateRefreshToken(verifyTokenResult)

        return success({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    }
}

export namespace JwtGateway {
    
    export type GenerateAcessTokenResult = {
        accessToken: string
        expirationDateTime: Date
    }

    export type GenerateRefreshTokenResult = {
        refreshToken: string
        expirationDateTime: Date
    }

    export type GenerateAccessTokenFromRefreshTokenResult = {
        accessToken: GenerateAcessTokenResult
        refreshToken: GenerateRefreshTokenResult
    }


    export type Tokens = {
        accessToken: string
        refreshToken: string
    }

    export type JwtModel = {
        userId: string
    }
}