import { Module } from '@nestjs/common';
import { StockRedemptionConsumerService } from './stock-redemption.consumer.service';
import { StockRedemptionController } from './stock-redemption.controller';



@Module({
  controllers: [ 
    
   ],
  providers: [ 
    StockRedemptionConsumerService,
    StockRedemptionController
  ]
})
export class StockRedemptionQueryModule {}
