import mongoose, { Schema, Document } from 'mongoose';
import { NotificationSeenModel } from "../../models"


export interface MongoNotificationSeen extends Document, NotificationSeenModel {
    id: string
}

const EventSchema: Schema = new Schema({ 
    id: { type: String, required: true, unique: true }, 
    userId: { type: String, required: true },
    notificationId: { type: String, required: true },
}, { strict: false }); 
EventSchema.index({ id: 1 }, { unique: true  });
EventSchema.index({ userId: 1, notificationId: 1  }, { unique: true  });

export const MongoNotificationSeenModel = mongoose.model<MongoNotificationSeen>('notification_seen', EventSchema);

