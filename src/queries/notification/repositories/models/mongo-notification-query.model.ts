import mongoose, { Schema, Document } from 'mongoose';
import { NotificationQueryModel } from "../../models"


export interface MongoNotificationQuery extends Document, NotificationQueryModel {
    id: string
}

const EventSchema: Schema = new Schema();
EventSchema.index({ id: 1 }, { unique: true  });

export const MongoNotificationQueryModel = mongoose.model<MongoNotificationQuery>('notification_query', EventSchema);

