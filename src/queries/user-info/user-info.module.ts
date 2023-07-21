import { Module } from '@nestjs/common';
import { StockUserInfoConsumerService } from './user-info.consumer.service';
import { StockRedemptionController } from './user-info.controller';



@Module({
  controllers: [ 
    
   ],
  providers: [ 
    StockUserInfoConsumerService,
    StockRedemptionController
  ]
})
export class UserInfoQueryModule {}
