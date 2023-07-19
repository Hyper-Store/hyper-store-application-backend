import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { 
  CreateStockUsecase
} from './usecases';
import { ServerAuthGuard } from 'src/guards';

@Controller('server/stock')
export class StockServerController {

  constructor(
    private readonly prismaService: PrismaService,
  ) {}


  @UseGuards(ServerAuthGuard)
  @Post()
  async create(@Body() body: any) {
    const createStockUsecase = new CreateStockUsecase(this.prismaService)
    return await createStockUsecase.execute(body)
  }


}
