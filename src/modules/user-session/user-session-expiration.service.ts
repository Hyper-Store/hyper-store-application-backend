import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseEvent } from '../@shared';
import { ExpireSessionUseCase } from './usecases';

@Injectable()
export class UserSessionExpirationService implements OnModuleInit {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly prismaService: PrismaService
    ) {}

    @RabbitRPC({
        exchange: 'userSession',
        routingKey: "SessionCreatedEvent",
        queue: "call-session-expiration-queue"
    })
    public async expirationQueue(msg: BaseEvent.Schema) {
    await this.amqpConnection.publish("", "session-expiration-handler", {
        sessionId: msg.payload.id
    }) 
    }

    @RabbitRPC({
        exchange: 'userSession',
        routingKey: "ExpireUserSession",
        queue: "expire-user-session-queue"
    })
    public async expireSessionQueue(msg: any) {    
    const expireSessionUseCase = new ExpireSessionUseCase(this.prismaService)
    await expireSessionUseCase.execute({ userSessionId: msg.sessionId })
    }

    async onModuleInit() {
    this.assertSessionExpirationQueue()
    }
    assertSessionExpirationQueue() {
    const minutesToExpire = parseFloat(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME_IN_MINUTES)
    const expiration = minutesToExpire * 1000 * 60 + 5000 // times 5 seconds
    this.amqpConnection.channel.assertQueue("session-expiration-handler", { 
        durable: true,
        deadLetterExchange: "userSession",
        deadLetterRoutingKey: "ExpireUserSession",
        messageTtl: expiration // 1 second
    })
    }
}
