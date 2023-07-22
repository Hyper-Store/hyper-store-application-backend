import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { UserPasswordChangedEvent } from "./user-password-changed.event";
import { UserNotFoundError } from "../_errors";

export class ChangeUserPasswordUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute({ userId, password }: ChangeUserPasswordUsecase.Input) {
            
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaUserRepository = new PrismaUserRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

            const userEntity = await prismaUserRepository.findById(userId)
            if(!userEntity) throw new UserNotFoundError()


            userEntity.changePassword(password)
            userEntity.encryptPassword(password)

            await prismaUserRepository.update(userEntity)

            const userPasswordChangedEvent = new UserPasswordChangedEvent({
                userId: userEntity.id,
                password: userEntity.password
            })
            await prismaRabbitmqOutbox.publish(userPasswordChangedEvent)
        })

    }
}

export namespace ChangeUserPasswordUsecase {
    
    export type Input = {
        userId: string
        password: string
    }
}