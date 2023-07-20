import { Module } from '@nestjs/common';
import { SignaturesConsumerService } from './signatures.consumer.service';



@Module({
  controllers: [ 
    
   ],
  providers: [ 
    SignaturesConsumerService
  ]
})
export class SignaturesQueryModule {}
