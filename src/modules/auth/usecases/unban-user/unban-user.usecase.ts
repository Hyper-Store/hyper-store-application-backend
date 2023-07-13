import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { UserUnBannedEvent } from "./user-unbanned.event";
import { UserNotFoundError } from "../_errors";
import { UserAlreadyUnBannedError } from "./errors";

export class UnBanUserUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute({ userId }: UnBanUserUsecase.Input) {
        
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaUserRepository = new PrismaUserRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

            const userEntity = await prismaUserRepository.findById(userId)
            if(!userEntity) throw new UserNotFoundError()
         
            if(!userEntity.isBanned()) throw new UserAlreadyUnBannedError()

            userEntity.unban()
            await prismaUserRepository.update(userEntity)

            const userBannedEvent = new UserUnBannedEvent({
                userId: userEntity.id
            })
            await prismaRabbitmqOutbox.publish(userBannedEvent)
        })

    }
}

export namespace UnBanUserUsecase {
    
    export type Input = {
        userId: string
    }
}