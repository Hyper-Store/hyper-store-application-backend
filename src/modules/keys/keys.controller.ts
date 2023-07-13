import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
  GenerateKeyUsecase, 
  RedeemKeyUsecase,
  ActivateKeyUsecase,
  DisableKeyUsecase
} from './usecases';
import { Request } from 'express';
import { AuthGuard, ServerAuthGuard } from 'src/guards';
import { StatusChangeDto } from './dto/status-change.dto';

@Controller('keys')
export class KeysController {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  @UseGuards(new ServerAuthGuard())
  @Post()
  async create(@Body() body: CreateKeyDto) {
    const generateKeyUsecase = new GenerateKeyUsecase(this.prismaService)
    return await generateKeyUsecase.execute(body)
  }

  @UseGuards(new ServerAuthGuard())
  @Post()
  async disable(@Body() body: StatusChangeDto) {
    const disableKeyUsecase = new DisableKeyUsecase(this.prismaService)
    return await disableKeyUsecase.execute(body)
  }

  @UseGuards(new ServerAuthGuard())
  @Post()
  async activate(@Body() body: StatusChangeDto) {
    const activateKeyUsecase = new ActivateKeyUsecase(this.prismaService)
    return await activateKeyUsecase.execute(body)
  }

  @UseGuards(new AuthGuard())
  @Post("/redeem/:key")
  async redeem(
    @Param("key") key: string,
    @Req() req: Request
  ) {
    const redeemKeyUsecase = new RedeemKeyUsecase(this.prismaService)
    return await redeemKeyUsecase.execute({
      key: key ?? "",
      keyRedeemerId: req.currentUser.userId
    })
  }

}
