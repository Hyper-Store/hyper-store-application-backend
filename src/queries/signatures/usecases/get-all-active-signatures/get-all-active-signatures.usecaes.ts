import { MongoSignatureRepository } from "../../repositories"

export class GetAllActiveSignaturesUsecase {

    
    async execute(userId: string) {
        const mongoSignatureRepository = new MongoSignatureRepository()
        return await mongoSignatureRepository.getAllActiveSignatures(userId)
    }
}