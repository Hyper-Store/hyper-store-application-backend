import mongoose from "mongoose"
import { MongoIdpotenceConsumer } from "../providers"

export class MongoIdpotenceConsumerService {

    static async consume(
        eventId: string,
        consumerName: string,
        callback: (session: mongoose.ClientSession) => Promise<any>
    ): Promise<any> {

        const session = await mongoose.startSession()
        try {
            session.startTransaction()

            const mongoIdpotenceConsumer = new MongoIdpotenceConsumer(session)
            const isEventRegistered = await mongoIdpotenceConsumer.isEventRegistered(eventId, consumerName)
            if(isEventRegistered) return

            const result = await callback(session)
            await mongoIdpotenceConsumer.registerEvent(eventId, consumerName)
            
            await session.commitTransaction()
            await session.endSession();

            return result
        }catch(err){
            await session.abortTransaction();
            await session.endSession();
            throw err
        }finally {
            await session.endSession();
        }
    }
}
