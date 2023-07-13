import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceUsecase } from './usecases';

@Controller('services')
export class ServicesController {

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  async create(@Body() body: CreateServiceDto) {
    const createServiceUsecase = new CreateServiceUsecase(this.prismaService)
    return await createServiceUsecase.execute(body)
  }

}
