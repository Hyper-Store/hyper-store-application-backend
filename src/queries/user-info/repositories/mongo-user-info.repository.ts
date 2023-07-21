import mongoose from "mongoose";
import { UserInfoModel } from "../models";
import { MongoUserInfoModel } from "./models";

export class MongoUserInfoRepository {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ){}

    async create(userInfoModel: UserInfoModel){
        await MongoUserInfoModel.create([{ ...userInfoModel }], { session: this.session })
    }

    async findById(id: string): Promise<UserInfoModel | null>{
        const user = await MongoUserInfoModel.findOne({ id }, null, { session: this.session })
        if(!user) return null
        return user.toObject()
    }

}

