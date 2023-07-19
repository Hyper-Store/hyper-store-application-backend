import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, UseGuards, HttpCode } from '@nestjs/common';
import { ServerAuthGuard } from 'src/guards';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CloseAllSessionsUsecase, CloseSessionUsecase } from './usecases';
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from 'src/infra/rabbitmq/rabbitmq.service';
import { BaseEvent } from '../@shared';
import { PrismaIdpotenceConsumerService } from '../@shared/services';


@Controller('server/user-session')
export class UserSessionController  {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly prismaIdpotenceConsumerService: PrismaIdpotenceConsumerService,

    ){}

    @HttpCode(200)
    @UseGuards(ServerAuthGuard)
    @Post("close-session/:userSessionId")
    async create(
        @Param('userSessionId') userSessionId: string,
    ) {
        const closeSessionUsecase = new CloseSessionUsecase(this.prismaService)
        return await closeSessionUsecase.execute({ userSessionId })
    }


    @RabbitRPC({
        exchange: 'auth',
        routingKey: "UserBannedEvent",
        queue: "close-all-users-session-when-banned-queue"
    })
    public async expirationQueue(msg: BaseEvent.Schema) {
        await this.prismaIdpotenceConsumerService.consume(
      msg.id,
      "close-all-users-session-when-banned-queue",
      async (prisma) => 
      new CloseAllSessionsUsecase(prisma)
        .execute({
          userId: msg.payload.userId,
        })
    )
    }
 
}
