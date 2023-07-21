import { Module } from '@nestjs/common';
import { ServiceConsumerService } from './service.consumer.service';



@Module({
  controllers: [ 
    
   ],
  providers: [ 
    ServiceConsumerService
  ]
})
export class ServicesQueryModule {}
