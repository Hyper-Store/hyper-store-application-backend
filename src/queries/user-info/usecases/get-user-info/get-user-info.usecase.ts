import mongoose from "mongoose"
import {  MongoUserInfoRepository } from "../../repositories"
import { UserInfoModel } from "../../models"

export class GetUserInfoUsecase {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(userId: string) {
        const mongoUserInfoRepository = new MongoUserInfoRepository(this.session)
        const userInfo = await mongoUserInfoRepository.findById(userId)
        return userInfo
    }
}