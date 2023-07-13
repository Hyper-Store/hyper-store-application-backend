import * as jwt from "jsonwebtoken"
import { MongoRefreshTokenRepository } from "../repositories"

export class JwtGateway {

    static async generateAccessToken({ email, userId }: JwtGateway.JwtModel): Promise<string> {
        return jwt.sign({
            email,
            userId,
            createdAt: new Date()
        }, 
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
        )
    }

    static async generateRefreshToken({ email, userId }: JwtGateway.JwtModel): Promise<string> {
        const daysToExpire = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS)
        const refreshToken = jwt.sign({
            email,
            userId,
            createdAt: new Date()
        }, 
        process.env.JWT_REFRESH_TOKEN_SECRET, 
        { expiresIn: `${daysToExpire}d` } )
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);
        await MongoRefreshTokenRepository.storeRefreshToken(refreshToken, userId, expirationDate)

        return refreshToken
    }

    static async verifyAccessToken(token: string): Promise<JwtGateway.JwtModel | null> {
        try {
            const { email, userId } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtGateway.JwtModel
            return { email, userId }
        }catch {
            return null
        }
    }

    static async verifyRefreshToken(refreshToken: string): Promise<JwtGateway.JwtModel | null> {
        try {
            const { email, userId }  = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET) as JwtGateway.JwtModel
            const storedRefreshToken = await MongoRefreshTokenRepository.findRefreshToken(refreshToken)
            if(!storedRefreshToken) return null
            
            return { email, userId } 
        } catch (error) {
            return null
        }
    }

    static async generateAccessTokenFromRefreshToken(refreshToken: string) {
        const verifyTokenResult = await JwtGateway.verifyRefreshToken(refreshToken)
        if(!verifyTokenResult) return null

        await MongoRefreshTokenRepository.deleteRefreshToken(refreshToken)
        
        const newAccessToken = await JwtGateway.generateAccessToken(verifyTokenResult)
        const newRefreshToken = await this.generateRefreshToken(verifyTokenResult)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }
}

export namespace JwtGateway {
    
    export type JwtModel = {
        userId: string
        email: string
    }
}