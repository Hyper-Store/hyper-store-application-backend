import { UserSectionEntity } from "../entities";
import { MongoUserSectionModel } from "./models";


export class MongoUserSectionRepository {

    
    async create(userSection: UserSectionEntity): Promise<void> {
        await MongoUserSectionModel.create(userSection.toJSON())
    }
}