import { Module } from '@nestjs/common';
import { StockServerController } from './stock.server.controller';

@Module({
  controllers: [StockServerController],
  providers: []
})
export class StockModule {}
