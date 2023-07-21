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
import { GetAllRedeemedStockUsecaseUsecase } from './usecases';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from 'src/modules/@shared';
import { WebsocketConnectionsService } from 'src/modules/websocket/websocket-connections.service';


@WebSocketGateway(1000)
export class StockRedemptionController{
    
    
    
    constructor(
        private readonly websocketConnectionsService: WebsocketConnectionsService
    ){}
    @WebSocketServer() server: Server;
    
    
    @RabbitRPC({
        exchange: 'stockRedemption',
        routingKey: "StockRedeemedEvent",
        queue: "show-websocket-stock-redeemed-query-queue",
    })
    async showRedeemedStock(msg: BaseEvent.Schema){
        const clients = this.websocketConnectionsService.getClients(msg.payload.userId)
        for(const client of clients) {
            const jsonString = JSON.stringify(msg.payload);
            const buffer =  Buffer.from(jsonString);
            client.emit('stock-redeemed', buffer);
        }
    }



    @SubscribeMessage('get-redeemed-stock')
    async messageConsumer(client: UserSocket, payload: any) {

        const requestJsonString = new TextDecoder('utf-8').decode(payload);
        const request = JSON.parse(requestJsonString);
        const getAllRedeemedStockUsecaseUsecase = new GetAllRedeemedStockUsecaseUsecase()
        
        const result = await getAllRedeemedStockUsecaseUsecase.execute({
            userId: client.userId,
            page: request?.page ?? 1,
            signatureId: request?.signatureId ?? ""
        })
        const jsonString = JSON.stringify(result);
        const buffer =  Buffer.from(jsonString);
        client.emit('get-redeemed-stock-result', buffer);
    }
        



}
