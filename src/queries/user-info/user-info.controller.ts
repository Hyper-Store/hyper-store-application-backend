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
import { GetUserInfoUsecase } from './usecases';


@WebSocketGateway( 1000,{
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    }
})
export class StockRedemptionController{

    
    constructor(
    ){}
    @WebSocketServer() server: Server;
        

    @SubscribeMessage('get-user-info')
    async messageConsumer(client: UserSocket, payload: any) {
        const getetUserInfoUsecase = new GetUserInfoUsecase()
        const result = await getetUserInfoUsecase.execute(client.userId)
        const jsonString = JSON.stringify(result);
        const buffer =  Buffer.from(jsonString);
        client.emit('get-user-info-response', buffer);
    }
        



}
