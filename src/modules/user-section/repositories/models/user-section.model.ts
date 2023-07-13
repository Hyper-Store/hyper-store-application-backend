import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    id: string
    userId: string
    ip: string
    userAgent: string
    token: string
}

const EventSchema: Schema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  token: { type: String, required: true },
});

export const MongoUserSectionModel = mongoose.model<IEvent>('userSection', EventSchema);

