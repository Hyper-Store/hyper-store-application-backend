import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from '../@shared';
import { MarkAsSeenUsecase } from './usecases';
import { WebsocketConnectionsService } from '../websocket/websocket-connections.service';
import { UserSocket } from '../websocket';



@WebSocketGateway(80)

export class NoficationController{

    
    @RabbitRPC({
        exchange: 'signature',
        routingKey: "SignatureCreatedEvent",
        queue: "message-websocket-queue"
    })
    async messageConsumer(msg: BaseEvent.Schema){
        const clients = this.websocketConnectionsService.getClients(msg.payload.userId)
        for(const client of clients) {
            client.emit('SignatureCreated', msg.payload)
        }
    }

    constructor(
        private readonly prismaService: PrismaService,
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){}
    @WebSocketServer() server: Server;


    @SubscribeMessage('mark-notification-as-seen')
    async handleMessage(client: UserSocket, payload: any): Promise<string> {
        const markAsSeenUsecase = new MarkAsSeenUsecase(this.prismaService)
        const result = await markAsSeenUsecase.execute({ 
            notificationId: payload.notificationId, 
            userId: client.userId 
        })
        if(result.isFailure()) return result.value
        return 'MessageReceived';
    }


}
