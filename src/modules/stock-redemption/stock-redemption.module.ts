import { Module } from '@nestjs/common';
import { StockRedemptionController } from './stock-redemption.controller';

@Module({
  controllers: [StockRedemptionController],
  providers: []
})
export class StockRedemptionModule {}
