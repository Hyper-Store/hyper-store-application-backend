import mongoose from "mongoose"
import { MongoNotificationQueryRepository } from "../repositories"
import { NotificationQueryModel } from "../models"

export class RegisterNotificationQueryUsecase {
    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(notificationQueryModel: NotificationQueryModel) {
        const mongoNotificationQueryRepository = new MongoNotificationQueryRepository(this.session)
        await mongoNotificationQueryRepository.create(notificationQueryModel)
    }
}

export namespace RegisterNotificationQueryUsecase {


}