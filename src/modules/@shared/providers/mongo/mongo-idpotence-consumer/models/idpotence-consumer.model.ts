import mongoose, { Schema, Document } from 'mongoose';

export interface IdpotenceConsumer extends Document {
    consumerName: string
    eventId: string
}

const EventSchema: Schema = new Schema({
    consumerName: { type: String, required: true },
    eventId: { type: String, required: true }
});
EventSchema.index({ consumerName: 1, eventId: 1 }, { unique: true });

export const MongoIdpotenceConsumerModel = mongoose.model<IdpotenceConsumer>('idpotenceConsumer', EventSchema);

