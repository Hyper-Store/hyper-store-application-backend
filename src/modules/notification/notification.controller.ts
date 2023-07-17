import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AccessTokenValidationService } from 'src/guards';

@WebSocketGateway(1000)
export class NoficationController implements OnGatewayConnection, OnGatewayDisconnect{

    constructor(
        private readonly prismaService: PrismaService
    ){}

    private clients = new Map<string, Socket[]>();

    async handleConnection(client: Socket, ...args: any[]) {

        const accessToken = client.handshake.query.accessToken as string ?? "" 
        const accessTokenValidationService = new AccessTokenValidationService(this.prismaService) 
        const user = await accessTokenValidationService.validate(accessToken)

        if(user.isFailure()) return client.disconnect() 

        if(!this.clients.has(user.value.userId)) this.clients.set(user.value.userId, [])
        this.clients.get(user.value.userId).push(client)

        console.log("connected", );
    }
  
    handleDisconnect(client: Socket) {
        // const userId = client.handshake.query.userId as string;
        // this.clients.delete(userId);
    }
  


}
