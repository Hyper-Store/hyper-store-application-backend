import mongoose from "mongoose";
import { NotificationQueryModel } from "../models";
import { MongoNotificationQueryModel } from "./models";

export class MongoNotificationQueryRepository {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ){}

    async create(notificationModel: NotificationQueryModel){
        await MongoNotificationQueryModel.create([{ ...notificationModel }], { session: this.session })
    }
}