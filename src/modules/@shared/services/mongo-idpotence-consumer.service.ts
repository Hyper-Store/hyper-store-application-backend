import mongoose from "mongoose"
import { MongoIdpotenceConsumer } from "../providers"

export class MongoIdpotenceConsumerService {

    static async consume(
        eventId: string,
        consumerName: string,
        callback: (session: mongoose.ClientSession) => Promise<any>
    ): Promise<any> {

        for(let i=0; i < 15; i++) { 
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

                if (err.message.includes('WriteConflict')) {
                    if(i === 14) throw err
                    continue
                }
                throw err
            }finally {
                await session.endSession();
            }
        }
    }
}
