import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceUsecase } from './usecases';
import { ServerAuthGuard } from 'src/guards';

@Controller('server/services')
export class ServicesController {

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  @UseGuards(new ServerAuthGuard())
  @Post()
  async create(@Body() body: CreateServiceDto) {
    const createServiceUsecase = new CreateServiceUsecase(this.prismaService)
    return await createServiceUsecase.execute(body)
  }

}
