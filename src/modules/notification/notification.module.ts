import { Module } from '@nestjs/common';
import { NoficationController } from './notification.controller';
import { NoficationHandlerService } from './notification.handler.service';
import { NotificationServerController } from './notification.server.controller';

@Module({
  controllers: [ 
    NotificationServerController
   ],
  providers: [ 
    NoficationController,
    NoficationHandlerService 
  ]
})
export class NotificationModule {}
