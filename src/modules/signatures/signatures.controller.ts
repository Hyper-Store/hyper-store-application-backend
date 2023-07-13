import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly prismaService: PrismaService) {}

  
}
