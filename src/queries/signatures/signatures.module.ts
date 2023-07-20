import { Module } from '@nestjs/common';
import { SignaturesConsumerService } from './signatures.consumer.service';
import { SignaturesQueryController } from './signatures.controller';



@Module({
  controllers: [ 
    
   ],
  providers: [ 
    SignaturesConsumerService,
    SignaturesQueryController
  ]
})
export class SignaturesQueryModule {}
