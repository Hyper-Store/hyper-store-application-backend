import { PrismaClient } from "@prisma/client";
import {  LoginDto } from "../../dto";
import { PrismaUserRepository } from "../../repositories";
import { InvalidCredentialsError } from "./_errors";
import { JwtGateway } from "../../gateways";

export class LoginUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute({ email, password }: LoginDto) {
        
        const prismaUserRepository = new PrismaUserRepository(this.prismaClient)

        const userEntity = await prismaUserRepository.findByEmail(email)
        if(!userEntity) throw new InvalidCredentialsError()

        const passwordMatch = await userEntity.comparePassword(password)
        if(!passwordMatch) throw new InvalidCredentialsError()

        const payload: JwtGateway.JwtModel = {
            userId: userEntity.id,
            email: userEntity.email
        }
        const accessToken = await JwtGateway.generateAccessToken(payload)
        const refreshToken = await JwtGateway.generateRefreshToken(payload)

        return { 
            accessToken,
            refreshToken
        };

    }
}