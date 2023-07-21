import { MongoStockRedeemedRepository } from "../../repositories"
import { MongoSignatureRepository } from "src/queries/signatures/repositories"

export class GetAllRedeemedStockUsecaseUsecase {

    
    async execute({ userId, page, signatureId }: GetAllRedeemedStockUsecaseUsecase.Input) {
        const mongoStockRedeemedRepository = new MongoStockRedeemedRepository()
        
        const mongoSignatureRepository = new MongoSignatureRepository(undefined as any)
        const signature = await mongoSignatureRepository.findById(signatureId)
        if(!signature) return []

        if(signature.userId !== userId) return []

        const result = await mongoStockRedeemedRepository.getAll({
            userId,
            page,
            signatureId
        })
        return result ?? []
    }
}

export namespace GetAllRedeemedStockUsecaseUsecase {
    export type Input = {
        userId: string
        signatureId: string
        page: number
    }
}