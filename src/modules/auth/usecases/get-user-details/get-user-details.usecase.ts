import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "../../repositories";
import { UserNotFoundError } from "../_errors";
import { UserSessionFacade } from "src/modules/user-session/facades";

export class GetUserDetailsUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
      ){}
    
    async execute({ userId, }: GetUserDetailsUsecase.Input) {
            
        const prismaUserRepository = new PrismaUserRepository(this.prismaClient)

        const userSessionFacade = new UserSessionFacade(this.prismaClient)

        const userEntity = await prismaUserRepository.findById(userId)
        if(!userEntity) throw new UserNotFoundError()
        
        let lastSession = {}
        const userLastSession = await userSessionFacade.getUserLastSession(userId)
        if(userLastSession) lastSession = userLastSession

        return {
            ...userEntity.toJSON(),
            lastSession
        }
    }
}

export namespace GetUserDetailsUsecase {
    
    export type Input = {
        userId: string
    }
}