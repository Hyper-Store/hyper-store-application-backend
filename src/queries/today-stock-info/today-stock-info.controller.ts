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
import { StockRedemptionFacade } from 'src/modules/stock-redemption/facades';


@WebSocketGateway(1000)
export class TodayStockInfoController{

    
    
    constructor(
        private readonly prismaService: PrismaService
    ){}
    @WebSocketServer() server: Server;
        

    @SubscribeMessage('get-today-stock-info')
    async messageConsumer(client: UserSocket, payload: any) {
        const requestJsonString = new TextDecoder('utf-8').decode(payload);
        const request = JSON.parse(requestJsonString);
        const stockRedemptionFacade = new StockRedemptionFacade(this.prismaService)
        const result = await stockRedemptionFacade.getTodayStockRedemptionInfo(
            client.userId,
            request?.signatureId
        )
        if(result.isFailure()) return result.value
        const jsonString = JSON.stringify(result.value);
        const buffer =  Buffer.from(jsonString);
        client.emit('get-today-stock-info-response', buffer);
    }
        



}
