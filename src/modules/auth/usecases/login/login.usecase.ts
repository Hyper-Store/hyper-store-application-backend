import { PrismaClient } from "@prisma/client";
import {  LoginDto } from "../../dto";
import { PrismaUserRepository } from "../../repositories";
import { InvalidCredentialsError } from "./_errors";
import { UserEntity } from "../../entities/user.entity";
import { UserSessionFacade } from "src/modules/user-session/facades";

export class LoginUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute({ value, password, ip, userAgent }: LoginDto & LoginUsecase.InputAditionalInfo) {
        
        const prismaUserRepository = new PrismaUserRepository(this.prismaClient)
        const userSessionFacade = new UserSessionFacade(this.prismaClient)

        let userEntity: UserEntity
        
        const isEmail = value.includes('@')
        if(isEmail) userEntity = await prismaUserRepository.findByEmail(value)
        else userEntity = await prismaUserRepository.findByUsername(value)
    
        if(!userEntity) throw new InvalidCredentialsError()

        const passwordMatch = await userEntity.comparePassword(password)
        if(!passwordMatch) throw new InvalidCredentialsError()

        const { accessToken, refreshToken } = await userSessionFacade.createSession({
            userId: userEntity.id,
            ip,
            userAgent
        })

        return { 
            accessToken,
            refreshToken
        };

    }
}

export namespace LoginUsecase {
    export type InputAditionalInfo = {
        ip: string
        userAgent: string
    }
}