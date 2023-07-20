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
import { GetAllActiveSignaturesUsecase } from './usecases';


@WebSocketGateway(1000)
export class SignaturesQueryController{


    constructor(
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){}
    
    @WebSocketServer() server: Server;


    async getUserSignaturesInBirary(userId: string) {
        const getAllActiveSignaturesUsecase = new GetAllActiveSignaturesUsecase()
        const signatures = await getAllActiveSignaturesUsecase.execute(userId)
        const jsonString = JSON.stringify(signatures);
        return Buffer.from(jsonString);
    }

    @RabbitRPC({
        exchange: 'queues',
        routingKey: "QuerySignatureRegisteredEvent",
        queue: "show-signature-updated-query-queue",
    })
    async messageConsumer(msg: BaseEvent.Schema){
        const clients = this.websocketConnectionsService.getClients(msg.payload.userId)
        const signatures = await this.getUserSignaturesInBirary(msg.payload.userId)
        for(const client of clients) {
            client.emit('activated-signatures', signatures)
        }
    }

    
    @RabbitRPC({
        exchange: 'queues',
        routingKey: "QuerySignatureUpdatedEvent",
        queue: "show-signature-updated-query-2-queue",
    })
    async signatureUpdated(msg: BaseEvent.Schema){
        const clients = this.websocketConnectionsService.getClients(msg.payload.userId)
        const signatures = await this.getUserSignaturesInBirary(msg.payload.userId)
        for(const client of clients) {
            client.emit('activated-signatures', signatures)
        }
    }

    @SubscribeMessage('retrieve-activated-signatures')
    async retrieveActivatedSignatures(client: UserSocket, payload: any): Promise<void> {
        const signatures = await this.getUserSignaturesInBirary(client.userId)
        
        client.emit('activated-signatures', signatures)
    }
    


}
