import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AccessTokenValidationService } from 'src/guards';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from '../@shared';
import { WebsocketConnectionsService } from './websocket-connections.service';
import { Console } from 'console';

export interface UserSocket extends Socket {
    userId: string
}

@WebSocketGateway( 1000,{
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    }
})
export class WebsocketController implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){
    }
    @WebSocketServer() server: Server;

    onModuleInit() {
        this.server.setMaxListeners(50)
    }

    @RabbitRPC({
        exchange: 'userSession',
        routingKey: "AllSessionsClosedEvent",
        queue: "close-all-websocket-connection-when-user-banned-queue"
    })
    async messageConsumer(msg: BaseEvent.Schema){
        const clients = this.websocketConnectionsService.getClients(msg.payload.userId)
        for(const client of clients) {
            client.disconnect()
        }
    }

    async handleConnection(client: UserSocket) {
        const accessToken = client.handshake.query.accessToken as string ?? "" 
        const accessTokenValidationService = new AccessTokenValidationService(this.prismaService) 
        const user = await accessTokenValidationService.validate(accessToken)
        
        if(user.isFailure()) {
            // InvalidAccessTokenError or UserBannedError
            client.emit(user.value, {})
            return client.disconnect() 
        }
        client.userId = user.value.userId

        this.websocketConnectionsService.addClient(client)
    }
  
    async handleDisconnect(client: UserSocket) {
        this.websocketConnectionsService.removeClient(client)
    }

  


}
