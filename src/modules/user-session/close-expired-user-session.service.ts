import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseEvent } from '../@shared';
import { CloseExpiredUserSessionUseCase } from './usecases';

@Injectable()
export class CloseExpiredUserSessionService implements OnModuleInit {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly prismaService: PrismaService
    ) {}

    @RabbitRPC({
        exchange: 'userSession',
        routingKey: "SessionExpiredEvent",
        queue: "call-close-user-session-queue"
    })
    public async expirationQueue(msg: BaseEvent.Schema) {
    await this.amqpConnection.publish("", "close-expired-session-handler", {
        sessionId: msg.payload.userSessionId
    }) 
    }

    @RabbitRPC({
        exchange: 'userSession',
        routingKey: "CloseUserSession",
        queue: "close-expired-user-session-queue"
    })
    public async expireSessionQueue(msg: any) {    
        const closeExpiredUserSessionUseCase = new CloseExpiredUserSessionUseCase(this.prismaService)
        await closeExpiredUserSessionUseCase.execute({ userSessionId: msg.sessionId })
    }

    async onModuleInit() {
        this.assertSessionExpirationQueue()
    }
    assertSessionExpirationQueue() {
        const minutesToExpire = parseFloat(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME_IN_MINUTES)
        const expiration = minutesToExpire * 1000 * 60 + 5000 // times 5 seconds
        this.amqpConnection.channel.assertQueue("close-expired-session-handler", { 
            durable: true,
            deadLetterExchange: "userSession",
            deadLetterRoutingKey: "CloseUserSession",
            messageTtl: expiration // 1 second
        })
    }
}
