import { UnauthorizedException } from "@nestjs/common"
import { PrismaUserRepository } from "../repositories"
import { PrismaClient } from "@prisma/client"

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
        if(!userEntity) throw new UserNotFoundError()
        return userEntity.isBanned()
    }
}