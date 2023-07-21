import { Module } from '@nestjs/common';
import { TodayStockInfoController } from './today-stock-info.controller';



@Module({
  controllers: [ 
    
   ],
  providers: [ 
    TodayStockInfoController
  ]
})
export class TodayStockInfoQueryModule {}
