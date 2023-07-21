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

    async getAll({ userId, page, signatureId }: MongoStockRedeemedRepository.GetAllInput){

    }
}

export namespace MongoStockRedeemedRepository {
    export type GetAllInput = {
        userId: string
        signatureId: string
        page: number
    }
}