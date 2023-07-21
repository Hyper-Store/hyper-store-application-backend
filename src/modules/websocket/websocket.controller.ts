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

@WebSocketGateway( {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    path: "websocket"
})
export class WebsocketController{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){}
    @WebSocketServer() server: Server;


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
  
    afterInit(server: Server) {
        server.on('headers', (headers, req) => {
          const origin = req.headers.origin;
    
          // Check the origin against your list of allowed origins.
          // Here, we're just checking it against a single allowed origin.
          const allowedOrigin = 'app://.';
          if (origin !== allowedOrigin) {
            // If the origin isn't allowed, we close the connection.
            req.destroy();
          }
        })
    }


}
