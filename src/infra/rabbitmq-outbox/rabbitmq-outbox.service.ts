import { Controller, Injectable, OnModuleInit } from '@nestjs/common';
import { MysqlConsumerService } from '../services';
import { MysqlResponseInterface } from '../services/mysql-consumer/interfaces';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { OutboxRecord } from './interface';
import { PublishEventRabbitmqService } from './publish-event-rabbitmq.service';

@Controller()
export class RabbitmqOutboxService implements OnModuleInit {

    constructor(
        private readonly mysqlConsumerService: MysqlConsumerService,
        private readonly amqpConnection: AmqpConnection,
        private readonly prismaService: PrismaService,
        private readonly publishEventRabbitmqService: PublishEventRabbitmqService
    ){}

    async onModuleInit() {
        await this.mysqlConsumerService.setUpConsumer({
            name: "RabbitmqOutbox",
            dbUrl: process.env.DATABASE_URL!,
            tableName: 'prisma_rabbitmq_outbox',
            statement: "INSERT"
        }, (events) => this.handleEvents(events))

    }

    async handleEvents(events: MysqlResponseInterface) {
        events.affectedRows.map(async (record) => {
            const event = record.after as OutboxRecord
            this.publishEventRabbitmqService.publish(event)
        })
    }
}
