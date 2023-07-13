import mongoose from "mongoose"
import { MongoIdpotenceConsumerModel } from "./models"

export class MongoIdpotenceConsumer {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ){}

    async registerEvent(eventId: string, consumerName: string){
        await MongoIdpotenceConsumerModel.create([{ consumerName, eventId }], { session: this.session })
    }

    async isEventRegistered(eventId: string, consumerName: string): Promise<boolean>{
        const event = await MongoIdpotenceConsumerModel.findOne({ consumerName, eventId }, null, { session: this.session })
        return !!event
    }
}
