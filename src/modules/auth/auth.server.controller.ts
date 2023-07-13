import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Res, Req, HttpCode, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { 
  UnBanUserUsecase,
  BanUserUsecase
} from './usecases';
import { Response, Request } from "express"
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto';
import { AuthGuard, ServerAuthGuard } from 'src/guards';
import { UserSectionService } from '../user-section/user-section.service';
import { UserIdDto } from './dto';

@Controller('server/auth')
export class AuthController {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    @UseGuards(new ServerAuthGuard())
    @Post("/ban")
    ban(
        @Body() body: UserIdDto
    ) {
        const banUserUsecase = new BanUserUsecase(this.prismaService)
        return banUserUsecase.execute(body);
    }

    @UseGuards(new ServerAuthGuard())
    @Post("/unban")
    unBan(@Body() body: UserIdDto) {
        const unBanUserUsecase = new UnBanUserUsecase(this.prismaService)
        return unBanUserUsecase.execute(body);
    }
}
