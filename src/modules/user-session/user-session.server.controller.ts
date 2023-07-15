import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, UseGuards, HttpCode } from '@nestjs/common';
import { ServerAuthGuard } from 'src/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloseSessionUsecase } from './usecases';


@Controller('server/user-session')
export class UserSessionController  {

    constructor(
        private readonly prismaService: PrismaService
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
}
