import mongoose from "mongoose"
import {  MongoServiceRepository } from "../../repositories"
import { ServiceModel } from "../../models"

export class RegisterServiceCreatedUsecase {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ) {}
    
    async execute(serviceModel: ServiceModel) {
        const mongoServiceRepository = new MongoServiceRepository(this.session)
        await mongoServiceRepository.create({
            ...serviceModel
        })

    }
}