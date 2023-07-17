import { Module } from '@nestjs/common';
import { NoficationController } from './notification.controller';

@Module({
  controllers: [  ],
  providers: [ NoficationController ]
})
export class NotificationModule {}
