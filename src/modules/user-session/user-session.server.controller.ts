import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, UseGuards, HttpCode } from '@nestjs/common';
import { ServerAuthGuard } from 'src/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloseSessionUsecase } from './usecases';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';


@Controller('server/user-session')
export class UserSessionController  {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly rabbitmqService: RabbitmqService,

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

    async test() {
        const response = await this.rabbitmqService.setupTemporaryConsumer("userSession", "SessionCreatedEvent", (message) => {
            console.log(message)
        })
        console.log(response)
    }
}
