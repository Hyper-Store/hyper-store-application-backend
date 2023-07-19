import mongoose from "mongoose";


export class MongoKeyRedemptionRepository {

    constructor(
        private readonly session: mongoose.mongo.ClientSession
    ){}
}