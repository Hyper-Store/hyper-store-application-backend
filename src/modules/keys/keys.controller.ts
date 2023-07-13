import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
  GenerateKeyUsecase, 
  RedeemKeyUsecase
} from './usecases';
import { Request } from 'express';
import { AuthGuard } from 'src/guards';

@Controller('keys')
export class KeysController {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  @Post()
  async create(@Body() body: CreateKeyDto) {
    const generateKeyUsecase = new GenerateKeyUsecase(this.prismaService)
    return await generateKeyUsecase.execute(body)
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
