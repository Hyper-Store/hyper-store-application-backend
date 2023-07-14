import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import "dotenv/config";

@Injectable()
export class MongooseService implements OnModuleInit {

    async onModuleInit() {

        try {
            await mongoose.connect(process.env.MONGODB_URL, {
                dbName: "app"
            })
        } catch (error) {
            console.error('MongoDB connection error:', error);
        }
    }

}
