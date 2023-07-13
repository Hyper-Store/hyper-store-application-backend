import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateKeyUsecase } from './usecases';

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


}
