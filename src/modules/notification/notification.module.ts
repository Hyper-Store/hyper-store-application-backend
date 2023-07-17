import { Module } from '@nestjs/common';
import { NoficationController } from './notification.controller';
import { NoficationHandlerService } from './notification.handler.service';

@Module({
  controllers: [  ],
  providers: [ 
    NoficationController,
    NoficationHandlerService 
  ]
})
export class NotificationModule {}
