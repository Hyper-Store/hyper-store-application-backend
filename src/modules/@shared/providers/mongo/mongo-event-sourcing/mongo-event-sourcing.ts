import { PrismaClient } from "@prisma/client/scripts/default-index";
import { BaseEvent } from "../../../base";
import mongoose from "mongoose";
import { MongoEventSouringModel } from "./models";

export class MongoEventSourcingProvider {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ){}

    async insertEvent(event: BaseEvent.Schema) {
        await MongoEventSouringModel.create([{
            id: event.id,
            eventName: event.eventName,
            topic: event.topic,
            schemaVersion: event.schemaVersion,
            dateTimeOccurred: event.dateTimeOccurred,
            payload: event.payload
        }], { session: this.session })
    }
}

