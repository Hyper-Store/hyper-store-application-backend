import { Module } from '@nestjs/common';
import { RabbitmqOutboxService } from './rabbitmq-outbox.service';
import { MysqlConsumerService } from '../services';
import { RetryRabbitmqOutboxService } from './retry-rabbitmq-outbox.service';
import { PublishEventRabbitmqService } from './publish-event-rabbitmq.service';

@Module({
    providers: [ 
        MysqlConsumerService,
        RabbitmqOutboxService,
        RetryRabbitmqOutboxService,
        PublishEventRabbitmqService
    ],
    imports: [ ],
    controllers: [
        
    ]
})
export class RabbitmqOutboxModule {}
