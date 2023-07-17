import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BaseEvent } from '../@shared';
import { SendNotificationUsecase } from './usecases';


@Injectable()
export class NoficationHandlerService{
    
    constructor(
        private readonly prismaService: PrismaService
    ){}
        
    @RabbitRPC({
        exchange: 'key',
        routingKey: "KeyRedeemedEvent",
        queue: "notification-key-redeemed-queue"
    })
    async messageConsumer(msg: BaseEvent.Schema){
        const sendNotificationUsecase = new SendNotificationUsecase(this.prismaService)
        await sendNotificationUsecase.execute({
            title: "KeyRedeemed",
            userId: msg.payload.keyRedeemerId,
            notificationInfo: {
                key: msg.payload.key
            }
        })
    }


}
