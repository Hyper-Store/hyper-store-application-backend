import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';

@Module({
  controllers: [ServicesController],
  providers: []
})
export class ServicesModule {}
