import mongoose from "mongoose"
import { MongoNotificationQueryRepository } from "../repositories"

export class MarkAsSeenUsecase {
    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute({ notificationId }: MarkAsSeenUsecase.Input) {
        const mongoNotificationQueryRepository = new MongoNotificationQueryRepository(this.session)

        const notificationModel = await mongoNotificationQueryRepository.findById(notificationId)
        
        if(!notificationModel) return
        notificationModel.isSeen = true

        await mongoNotificationQueryRepository.update(notificationModel)
    }
}

export namespace MarkAsSeenUsecase {
    export type Input = {
        notificationId: string
    }
}
