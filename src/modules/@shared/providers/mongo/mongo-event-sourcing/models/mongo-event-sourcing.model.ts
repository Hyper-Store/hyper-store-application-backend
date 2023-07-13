import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    id: string
    eventName: string
    topic: string
    schemaVersion: string
    dateTimeOccurred: Date
    payload: any
}

const EventSchema: Schema = new Schema({
  id: { type: String, required: true },
  eventName: { type: String, required: true },
  topic: { type: String, required: true },
  schemaVersion: { type: String, required: true },
  dateTimeOccurred: { type: Date, required: true },
  payload: { type: Object, required: true }
});

export const MongoEventSouringModel = mongoose.model<IEvent>('eventSourcing', EventSchema);

