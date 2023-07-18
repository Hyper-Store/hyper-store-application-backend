import mongoose from "mongoose";
import { NotificationSeenModel } from "../models";
import { MongoNotificationSeenModel } from "./models";

export class MongoNotificationSeenRepository {

    constructor(
        private readonly session: mongoose.mongo.ClientSession
    ){}

    async create(notificationSeenModel: NotificationSeenModel){
        await MongoNotificationSeenModel.create([{ ...notificationSeenModel }], { session: this.session })
    }

}