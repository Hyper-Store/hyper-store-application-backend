import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Res, Req, HttpCode, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { 
  UnBanUserUsecase,
  BanUserUsecase
} from './usecases';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ServerAuthGuard } from 'src/guards';
import { UserIdDto } from './dto';

@Controller('server/auth')
export class AuthServerController {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    @UseGuards(ServerAuthGuard)
    @Post("/ban")
    ban(
        @Body() body: UserIdDto
    ) {
        const banUserUsecase = new BanUserUsecase(this.prismaService)
        return banUserUsecase.execute(body);
    }

    @UseGuards(ServerAuthGuard)
    @Post("/unban")
    unBan(@Body() body: UserIdDto) {
        const unBanUserUsecase = new UnBanUserUsecase(this.prismaService)
        return unBanUserUsecase.execute(body);
    }
}
