import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, UseGuards, HttpCode } from '@nestjs/common';
import { ServerAuthGuard } from 'src/guards';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from 'src/infra/rabbitmq/rabbitmq.service';
import { BaseEvent } from '../@shared';
import { PrismaIdpotenceConsumerService } from '../@shared/services';
import { WebsocketConnectionsService } from './websocket-connections.service';


@Controller('server/websocket')
export class WebsocketInfoController  {

    constructor(
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){}

    @HttpCode(200)
    @UseGuards(ServerAuthGuard)
    @Post("people-connected-count")
    async create() {
        return {
            count: this.websocketConnectionsService.getPeopleConnectedCount()
        }
    }


 
}
