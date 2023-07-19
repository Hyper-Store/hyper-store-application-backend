import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { Request } from "express"
import { 
  RedeemStockUsecase
} from './usecases';
import { AuthGuard } from 'src/guards';

@Controller('stock-redemption')
export class StockRedemptionController {

  constructor(
    private readonly prismaService: PrismaService,
  ) {}


  @UseGuards(AuthGuard)
  @Post()
  async redeemStock(
    @Body() body: any,
    @Req() req: Request
  ) {
    const redeemStockUsecase = new RedeemStockUsecase(this.prismaService)
    return await redeemStockUsecase.execute({
      signatureId: body.signatureId ?? "",
      userId: req.currentUser.userId
    })
  }


}
