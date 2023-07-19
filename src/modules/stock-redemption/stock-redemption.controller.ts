import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

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
  async create(@Body() body: any) {
    const redeemStockUsecase = new RedeemStockUsecase(this.prismaService)
    return await redeemStockUsecase.execute(body)
  }


}
