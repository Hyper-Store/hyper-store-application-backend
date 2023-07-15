import { PrismaClient } from "@prisma/client";
import { CreateUserDto, UserIdDto } from "../../dto";
import { PrismaUserRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { UserEntity } from "../../entities/user.entity";
import { UserBannedEvent } from "./user-banned.event";
import { UserNotFoundError } from "../_errors";
import { UserAlreadyBannedError } from "./errors";

export class BanUserUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute({ userId }: UserIdDto) {
            
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaUserRepository = new PrismaUserRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

            const userEntity = await prismaUserRepository.findById(userId)
            if(!userEntity) throw new UserNotFoundError()
         
            if(userEntity.isBanned()) throw new UserAlreadyBannedError()

            userEntity.ban()
            await prismaUserRepository.update(userEntity)

            const userBannedEvent = new UserBannedEvent({
                userId: userEntity.id
            })
            await prismaRabbitmqOutbox.publish(userBannedEvent)
        })

    }
}

export namespace BanUserUsecase {
    
    export type Input = {
        userId: string
    }
}