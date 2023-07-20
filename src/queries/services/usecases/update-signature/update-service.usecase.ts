import mongoose from "mongoose"

import { PrismaRabbitmqOutbox } from "src/modules/@shared/providers"
import { PrismaClient } from "@prisma/client"
import { MongoServiceRepository } from "../../repositories"
import { ServiceModel } from "../../models"


export class UpdateServiceUsecase {

    constructor(
        private readonly session: mongoose.mongo.ClientSession
    ) {}
    
    async execute(serviceModel: Partial<ServiceModel> ) {

        const mongoServiceRepository = new MongoServiceRepository(this.session)
        await mongoServiceRepository.update(serviceModel)
    }
}