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
import { AccessTokenValidationService } from 'src/guards';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from '../@shared';
import { WebsocketConnectionsService } from './websocket-connections.service';

export interface UserSocket extends Socket {
    userId: string
}



@WebSocketGateway(1000, {
    cors: {
        origin: '*',
        allowedHeaders: "*"
    }
})
export class WebsocketController{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){}
    @WebSocketServer() server: Server;


    @SubscribeMessage('main-message')
    async handleMessage(client: UserSocket, payload: any): Promise<string> {
        return 'MessageReceived';
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
