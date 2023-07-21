import mongoose, { Schema, Document } from 'mongoose';
import {  UserInfoModel } from "../../models"


export interface MongoUserInfo extends Document, UserInfoModel {
    id: string
}

const EventSchema: Schema = new Schema({ 
    id: { type: String, required: true, unique: true }, 
}, { strict: false });
EventSchema.index({ id: 1 }, { unique: true  });

export const MongoUserInfoModel = mongoose.model<MongoUserInfo>('user_info', EventSchema);

