import mongoose from "mongoose";
import { NotificationQueryModel } from "../models";
import { MongoNotificationQueryModel } from "./models";

export class MongoNotificationQueryRepository {

    constructor(
        private readonly session: mongoose.mongo.ClientSession
    ){}

    async create(notificationModel: NotificationQueryModel){
        await MongoNotificationQueryModel.create([{ ...notificationModel, id: notificationModel.id }], { session: this.session })
    }

    async findById(id: string): Promise<NotificationQueryModel | null>{
        const mongoData = await MongoNotificationQueryModel.findOne({ id }, null, { session: this.session })
        if(!mongoData) return null
        return mongoData.toObject()
    }

    async update(notificationModel: NotificationQueryModel){
        await MongoNotificationQueryModel.updateOne({ id: notificationModel.id },  { $set: { ...notificationModel }}, { session: this.session })
    }
}