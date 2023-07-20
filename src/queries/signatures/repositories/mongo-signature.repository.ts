import mongoose from "mongoose";
import { SignatureModel } from "../models";
import { MongoSignatureModel } from "./models";

export class MongoNotificationQueryRepository {

    constructor(
        private readonly session?: mongoose.mongo.ClientSession
    ){}

    async create(signatureModel: SignatureModel){
        await MongoSignatureModel.create([{ ...signatureModel }], { session: this.session })
    }

    async findById(id: string): Promise<SignatureModel | null>{
        const mongoData = await MongoSignatureModel.findOne({ id }, null, { session: this.session })
        if(!mongoData) return null
        return mongoData.toObject()
    }

    async update(signatureModel: Partial<SignatureModel>){
        const currentSignatureModel = await this.findById(signatureModel?.id)
        if(!currentSignatureModel) return

        const updateProps = {} as any
        
        for(const key of Object.keys(signatureModel)) {
            if(signatureModel[key] !== currentSignatureModel[key]) {
                updateProps[key] = signatureModel[key]
            }
        }
        delete updateProps?.id
        await MongoSignatureModel.updateOne({ id: signatureModel.id },  { $set: { ...updateProps }}, { session: this.session })
    }

    async getAllActiveSignatures(userId: string): Promise<SignatureModel[]>{
        const mongoData = await MongoSignatureModel.find({ 
            userId,
            expirationDate: { $gte: new Date() }
         }, null, { session: this.session })
        return mongoData.map(signature => signature.toObject()) ?? []
    }
}