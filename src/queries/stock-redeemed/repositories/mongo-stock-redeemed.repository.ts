import mongoose from "mongoose";
import { StockRedeemedModel } from "../models";
import { MongoStockRedeemedModel } from "./models";

export class MongoStockRedeemedRepository {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ){}

    async create(stockRedeemedModel: StockRedeemedModel){
        await MongoStockRedeemedModel.create([{ ...stockRedeemedModel }], { session: this.session })
    }

    async getAll({ userId, page, signatureId }: MongoStockRedeemedRepository.GetAllInput): Promise<any>{
        const result = await MongoStockRedeemedModel.find({
            userId,
            signatureId
        })
        .skip((page - 1) * 6)
        .limit(6)
        .sort({ dateTimeRedeemed: -1 })
        .exec()
        return result
    }
}

export namespace MongoStockRedeemedRepository {
    export type GetAllInput = {
        userId: string
        signatureId: string
        page: number
    }
}