import mongoose from "mongoose"
import {  MongoUserInfoRepository } from "../../repositories"
import { UserInfoModel } from "../../models"

export class RegisterUserInfoUsecase {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(userInfoModel: UserInfoModel) {
        const mongoUserInfoRepository = new MongoUserInfoRepository(this.session)
        await mongoUserInfoRepository.create({
            ...userInfoModel
        })
    }
}