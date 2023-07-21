import mongoose, { Schema, Document } from 'mongoose';
import {  StockRedeemedModel } from "../../models"


export interface MongoStockRedeemed extends Document, StockRedeemedModel {
    id: string
}

const EventSchema: Schema = new Schema({ 
    id: { type: String, required: true, unique: true }, 
}, { strict: false });
EventSchema.index({ id: 1 }, { unique: true  });

export const MongoStockRedeemedModel = mongoose.model<MongoStockRedeemed>('stock_redeemed', EventSchema);

