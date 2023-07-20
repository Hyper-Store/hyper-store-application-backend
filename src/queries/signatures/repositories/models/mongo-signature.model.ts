import mongoose, { Schema, Document } from 'mongoose';
import { SignatureModel } from "../../models"


export interface MongoSignature extends Document, SignatureModel {
    id: string
}

const EventSchema: Schema = new Schema({ 
    id: { type: String, required: true, unique: true }, 
}, { strict: false });
EventSchema.index({ id: 1 }, { unique: true  });

export const MongoSignatureModel = mongoose.model<MongoSignature>('signatures', EventSchema);

