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


@WebSocketGateway(1000)
export class StockRedemptionController{

    
    
    constructor(
    ){}
    @WebSocketServer() server: Server;
        

    @SubscribeMessage('get-redeemed-stock')
    async messageConsumer(client: UserSocket, payload: any) {
        const getAllRedeemedStockUsecaseUsecase = new GetAllRedeemedStockUsecaseUsecase()
        return await getAllRedeemedStockUsecaseUsecase.execute({
            userId: client.userId,
            page: payload?.page ?? 1,
            signatureId: payload?.signatureId ?? ""
        })
    }
        



}
