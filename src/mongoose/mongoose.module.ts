import { Global, Module } from '@nestjs/common';
import { MongooseService } from './mongoose.service';

@Global()
@Module({
    providers: [MongooseService],
    exports: [ MongooseService ]
})
export class MongooseModule {}
