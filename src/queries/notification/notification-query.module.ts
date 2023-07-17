import { Module } from '@nestjs/common';
import { NotificationQueryPersistService } from './notification-query.persist.service';


@Module({
  controllers: [ 
    
   ],
  providers: [ 
    NotificationQueryPersistService
  ]
})
export class NotificationQueryModule {}
