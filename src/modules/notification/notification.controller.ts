import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
import { MarkAsSeenUsecase } from './usecases';


interface UserSocket extends Socket {
    userId: string
}

@WebSocketGateway(1000)
export class NoficationController implements OnGatewayConnection, OnGatewayDisconnect{

    
    @RabbitRPC({
        exchange: 'signature',
        routingKey: "SignatureCreatedEvent",
        queue: "message-websocket-queue"
    })
    async messageConsumer(msg: BaseEvent.Schema){
        const clients = this.clients.get(msg.payload.userId)
        for(const client of clients.values()) {
            client.emit('SignatureCreated', msg.payload)
        }
    }

    constructor(
        private readonly prismaService: PrismaService
    ){}
    private clients = new Map<string, Map<string, UserSocket> >();
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



    async handleConnection(client: UserSocket) {
        const accessToken = client.handshake.query.accessToken as string ?? "" 
        const accessTokenValidationService = new AccessTokenValidationService(this.prismaService) 
        const user = await accessTokenValidationService.validate(accessToken)

        if(user.isFailure()) return client.disconnect() 
        client.userId = user.value.userId

        if(!this.clients.has(client.userId)) {
            this.clients.set(client.userId, new Map())
        }
        this.clients.get(client.userId).set(client.id, client)

    }
  
    async handleDisconnect(client: UserSocket) {
        if(!client.userId) return
        this.clients.get(client.userId).delete(client.id)
        if(this.clients.get(client.userId).size === 0) this.clients.delete(client.userId)
    }
  


}
