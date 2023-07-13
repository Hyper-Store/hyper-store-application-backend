import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from "../../dto";
import { PrismaUserRepository } from "../../repositories";
import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers";
import { EmailAlreadyRegisteredError, UsernameAlreadyRegisteredError } from "./errors";
import { UserEntity } from "../../entities/user.entity";
import { UserCreatedEvent } from "./user-created.event";

export class SignupUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute(createUserDto: CreateUserDto) {
        
        return await this.prismaClient.$transaction(async (prisma: PrismaClient) => {
            const prismaUserRepository = new PrismaUserRepository(prisma)
            const prismaRabbitmqOutbox = new PrismaRabbitmqOutbox(prisma)

            const existingEmail = await prismaUserRepository.findByEmail(createUserDto.email)
            if(existingEmail) throw new EmailAlreadyRegisteredError()
            
            const existingUsername = await prismaUserRepository.findByUsername(createUserDto.username)
            if(existingUsername) throw new UsernameAlreadyRegisteredError()
            
            const userEntity = new UserEntity({
                ...createUserDto
            })
            await userEntity.encryptPassword(createUserDto.password)

            await prismaUserRepository.create(userEntity)

            const userCreatedEvent = new UserCreatedEvent({
                ...userEntity.toJSON()
            })
            await prismaRabbitmqOutbox.publish(userCreatedEvent)

            return { id: userEntity.id };
        })

    }
}