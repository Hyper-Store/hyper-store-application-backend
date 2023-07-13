import { PrismaClient } from "@prisma/client";
import {  LoginDto } from "../../dto";
import { PrismaUserRepository } from "../../repositories";
import { InvalidCredentialsError } from "./_errors";
import { JwtGateway } from "../../gateways";
import { UserEntity } from "../../entities/user.entity";

export class LoginUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute({ value, password }: LoginDto) {
        
        const prismaUserRepository = new PrismaUserRepository(this.prismaClient)

        let userEntity: UserEntity
        
        const isEmail = value.includes('@')
        if(isEmail) userEntity = await prismaUserRepository.findByEmail(value)
        else userEntity = await prismaUserRepository.findByUsername(value)
    
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