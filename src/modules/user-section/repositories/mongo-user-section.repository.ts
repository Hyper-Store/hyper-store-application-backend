import { UserSectionEntity } from "../entities";
import { MongoUserSectionModel } from "./models";


export class MongoUserSectionRepository {

    
    async create(userSection: UserSectionEntity): Promise<void> {
        await MongoUserSectionModel.create(userSection.toJSON())
    }

    async findByAccessToken(accessToken: string): Promise<UserSectionEntity | null> {
        const userSection = await MongoUserSectionModel.findOne({ accessToken })
        if(!userSection) return null
        return new UserSectionEntity(userSection.toJSON(), userSection.id)
    }

    async findByUserId(userId: string): Promise<UserSectionEntity | null> {
        const userSection = await MongoUserSectionModel.findOne({ userId })
        if(!userSection) return null
        return new UserSectionEntity(userSection.toJSON(), userSection.id)
    }

    async update(userSection: UserSectionEntity): Promise<void> {
        await MongoUserSectionModel.updateOne({ id: userSection.id }, userSection.toJSON())
    }
}