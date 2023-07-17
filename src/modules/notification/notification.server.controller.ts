import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
  SendGlobalNotificationUsecase
} from './usecases';
import { ServerAuthGuard } from 'src/guards';

@Controller('server/notification')
export class NotificationServerController {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  @UseGuards(ServerAuthGuard)
  @Post("send-global-notification")
  async create(@Body() body: any) {
    const sendGlobalNotificationUsecase = new SendGlobalNotificationUsecase(this.prismaService)
    return await sendGlobalNotificationUsecase.execute({
        title: body.title ?? "",
        notificationInfo: {
            ...body.notificationInfo
        }
    })
  }

}


