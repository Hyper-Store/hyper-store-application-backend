import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "../../repositories";
import { UserNotFoundError } from "../_errors";
import { UserSessionFacade } from "src/modules/user-session/facades";
import { UserEntity } from "../../entities/user.entity";

export class GetUserDetailsUsecase {

    constructor(
        private readonly prismaClient: PrismaClient,
    ) { }

    async execute({ userId, email, username }: GetUserDetailsUsecase.Input) {

        const prismaUserRepository = new PrismaUserRepository(this.prismaClient)

        const userSessionFacade = new UserSessionFacade(this.prismaClient)

        let userEntity: UserEntity

        if (userId) userEntity = await prismaUserRepository.findById(userId)
        if (username) userEntity = await prismaUserRepository.findByUsername(username)
        if (email) userEntity = await prismaUserRepository.findByEmail(email);

        if (!userEntity) throw new UserNotFoundError()

        let lastSession = {}
        const userLastSession = await userSessionFacade.getUserLastSession(userId)
        if (userLastSession) lastSession = userLastSession

        return {
            ...userEntity.toJSON(),
            lastSession
        }
    }
}

export namespace GetUserDetailsUsecase {

    export type Input = {
        userId?: string,
        username?: string,
        email?: string
    }
}