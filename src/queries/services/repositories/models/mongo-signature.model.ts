import mongoose, { Schema, Document } from 'mongoose';
import {  ServiceModel } from "../../models"


export interface MongoService extends Document, ServiceModel {
    id: string
}

const EventSchema: Schema = new Schema({ 
    id: { type: String, required: true, unique: true }, 
}, { strict: false });
EventSchema.index({ id: 1 }, { unique: true  });

export const MongoServiceModel = mongoose.model<MongoService>('services', EventSchema);

