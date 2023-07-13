import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshTokenModel extends Document {
    refreshToken: string;
    expirationDate: Date;
}

const EventSchema: Schema = new Schema({
    refreshToken: { type: String, required: true,  },
    userId: { type: String, required: true,  },
    expirationDate: { type: Date, required: true }
});
EventSchema.index({ refreshToken: 1 }, { unique: true });
EventSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });
EventSchema.index({ userId: 1 });

export const MongoRefreshTokenModel = mongoose.model<IRefreshTokenModel>('RefreshToken', EventSchema);