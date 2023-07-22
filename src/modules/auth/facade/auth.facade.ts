import { UnauthorizedException } from "@nestjs/common"
import { PrismaUserRepository } from "../repositories"
import { PrismaClient } from "@prisma/client"
import { UserEntity } from "../entities/user.entity"

export class UserNotFoundError extends UnauthorizedException {

    constructor(){
        super({
            name: "UserNotFoundError"
        })
    }
  }
  

export class AuthFacade {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async isUserBanned(userId: string) {
        const userRepository = new PrismaUserRepository(this.prismaClient)
        const userEntity = await userRepository.findById(userId)
        if(!userEntity) return true
        return userEntity.isBanned()
    }

    async getUserDetails(userId: string): Promise<UserEntity.PropsJSON | null> {
        const userRepository = new PrismaUserRepository(this.prismaClient)
        const userEntity = await userRepository.findById(userId)
        if(!userEntity) return null
        return userEntity.toJSON()
    }
}