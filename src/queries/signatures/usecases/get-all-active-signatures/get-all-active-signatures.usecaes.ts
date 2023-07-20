import { MongoNotificationQueryRepository } from "../../repositories"

export class GetAllActiveSignaturesUsecase {

    
    async execute(userId: string) {
        const mongoNotificationQueryRepository = new MongoNotificationQueryRepository()
        return await mongoNotificationQueryRepository.getAllActiveSignatures(userId)
    }
}