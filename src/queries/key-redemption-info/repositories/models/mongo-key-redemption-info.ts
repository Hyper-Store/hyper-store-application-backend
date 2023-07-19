import mongoose, { Schema, Document } from 'mongoose';
import { KeyRedemptionInfoModel } from "../../models"


export interface MongoKeyRedemptionInfoQuery extends Document, KeyRedemptionInfoModel {
    id: string
}

const EventSchema: Schema = new Schema({ 
    key: { type: String, required: true, unique: true }, 
}, { strict: false });
EventSchema.index({ key: 1 }, { unique: true  });

export const MongoKeyRedemptionModel = mongoose.model<MongoKeyRedemptionInfoQuery>('mongo_key_redemption', EventSchema);

