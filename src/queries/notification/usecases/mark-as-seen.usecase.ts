import mongoose from "mongoose"
import { MongoNotificationSeenRepository } from "../repositories/mongo-notification-seen.repository"
import { NotificationSeenModel } from "../models"

export class MarkAsSeenUsecase {
    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(notificationSeenModel: NotificationSeenModel) {
        const mongoNotificationSeenRepository = new MongoNotificationSeenRepository(this.session)
        await mongoNotificationSeenRepository.create(notificationSeenModel)
    }
}

export namespace MarkAsSeenUsecase {
    export type Input = {
        notificationId: string
    }
}
