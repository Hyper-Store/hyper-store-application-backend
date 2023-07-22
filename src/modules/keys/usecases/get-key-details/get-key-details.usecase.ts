import { PrismaClient } from "@prisma/client"
import { KeyEntity } from "../../entities"
import { PrismaKeyRepository } from "../../respositories"
import { KeyNotFoundError } from "../_errors"
import { ServiceFacade } from "src/modules/services/facades"
import { AuthFacade } from "src/modules/auth/facade"

export class GetKeyDetailsUsecase {


    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async execute({ key }: GetKeyDetailsUsecase.Input): Promise<GetKeyDetailsUsecase.Output> {
        
        const keyRepository = new PrismaKeyRepository(this.prismaClient)
        const serviceFacade = new ServiceFacade(this.prismaClient)
        const authFacade = new AuthFacade(this.prismaClient)

        const KeyEntity = await keyRepository.findByKey(key)
        if(!KeyEntity) throw new KeyNotFoundError()

        const serviceDetails = await serviceFacade.getServiceDetails(KeyEntity.serviceId)

        let userDetails = {}
        if(KeyEntity.isRedeemed()) {
            userDetails = await authFacade.getUserDetails(KeyEntity.keyRedeemerId)
        }

        return {
            ...KeyEntity.toJSON(),
            service: {
                ...serviceDetails
            },
            user: {
                ...userDetails
            }
        }
    }
}

export namespace GetKeyDetailsUsecase {

    export type Input = {
        key: string
    }

    export type Output = KeyEntity.PropsJSON & { service: any, user?: any }
}