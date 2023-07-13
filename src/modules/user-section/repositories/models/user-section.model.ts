import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    id: string
    userId: string
    ip: string
    userAgent: string
    accessToken: string
}

const EventSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  accessToken: { type: String, required: true, unique: true },
});

export const MongoUserSectionModel = mongoose.model<IEvent>('userSection', EventSchema);

