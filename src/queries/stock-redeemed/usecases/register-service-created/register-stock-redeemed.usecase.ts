import mongoose from "mongoose"
import {  MongoStockRedeemedRepository } from "../../repositories"
import { StockRedeemedModel } from "../../models"

export class RegisterStockRedeemedUsecase {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(stockRedeemedModel: StockRedeemedModel) {
        const mongoStockRedeemedRepository = new MongoStockRedeemedRepository(this.session)
        await mongoStockRedeemedRepository.create({
            ...stockRedeemedModel
        })
    }
}