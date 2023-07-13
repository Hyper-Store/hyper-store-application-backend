import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
  RedeemKeyUsecase,
} from './usecases';
import { Request } from 'express';
import { AuthGuard, } from 'src/guards';

@Controller('keys')
export class KeysController {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  @UseGuards(AuthGuard)
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
