import { Module } from '@nestjs/common';
import { ServicesController } from './services.server.controller';

@Module({
  controllers: [ServicesController],
  providers: []
})
export class ServicesModule {}
