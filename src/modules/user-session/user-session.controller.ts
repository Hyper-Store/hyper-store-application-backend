import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user-session')
export class UserSessionController {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  
}
