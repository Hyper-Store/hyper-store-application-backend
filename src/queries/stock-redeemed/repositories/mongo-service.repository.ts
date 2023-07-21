import mongoose from "mongoose";
import { ServiceModel } from "../models";
import { MongoServiceModel } from "./models";

export class MongoServiceRepository {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ){}

    async create(serviceModel: ServiceModel){
        await MongoServiceModel.create([{ ...serviceModel }], { session: this.session })
    }

    async findById(id: string): Promise<ServiceModel | null>{
        const mongoData = await MongoServiceModel.findOne({ id }, null, { session: this.session })
        if(!mongoData) return null
        return mongoData.toObject()
    }

    async update(serviceModel: Partial<ServiceModel>){
        const currentServiceModel = await this.findById(serviceModel?.id)
        if(!currentServiceModel) return

        const updateProps = {} as any
        
        for(const key of Object.keys(serviceModel)) {
            if(serviceModel[key] !== currentServiceModel[key]) {
                updateProps[key] = serviceModel[key]
            }
        }
        delete updateProps?.id
        await MongoServiceModel.updateOne({ id: serviceModel.id },  { $set: { ...updateProps }}, { session: this.session })
    }


}