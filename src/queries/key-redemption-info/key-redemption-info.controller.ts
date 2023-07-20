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

import { UserSocket } from 'src/modules/websocket';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from 'src/modules/@shared';
import { WebsocketConnectionsService } from 'src/modules/websocket/websocket-connections.service';


@WebSocketGateway()
export class KeyRedemptionInfoController{

    
    
    constructor(
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){}
    @WebSocketServer() server: Server;
        
    @RabbitRPC({
        exchange: 'queues',
        routingKey: "KeyRedemptionInfoProcessedEvent",
        queue: "show-key-redemption-info",
    })
    async messageConsumer(msg: BaseEvent.Schema){
        const clients = this.websocketConnectionsService.getClients(msg.payload.userId)
        for(const client of clients) {
            const jsonString = JSON.stringify(msg.payload);
            const binaryData = Buffer.from(jsonString);
            client.emit('key-redeemed-success', binaryData)
        }
    }


}
