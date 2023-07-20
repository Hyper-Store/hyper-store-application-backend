import { Module } from '@nestjs/common';
import { ServicesController } from './services.server.controller';
import { DefaultServiceCreationService } from './default-service-creation.service';

@Module({
  controllers: [ServicesController],
  providers: [
    DefaultServiceCreationService
  ]
})
export class ServicesModule {}
