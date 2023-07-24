import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Res, Req, HttpCode, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
    UnBanUserUsecase,
    BanUserUsecase,
    ChangeUserPasswordUsecase,
    GetUserDetailsUsecase
} from './usecases';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ServerAuthGuard } from 'src/guards';
import { UserIdDto } from './dto';

@Controller('server/auth')
export class AuthServerController {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    @HttpCode(200)
    @UseGuards(ServerAuthGuard)
    @Post("/ban")
    ban(
        @Body() body: UserIdDto
    ) {
        const banUserUsecase = new BanUserUsecase(this.prismaService)
        return banUserUsecase.execute(body);
    }

    @HttpCode(200)
    @UseGuards(ServerAuthGuard)
    @Post("/unban")
    unBan(@Body() body: UserIdDto) {
        const unBanUserUsecase = new UnBanUserUsecase(this.prismaService)
        return unBanUserUsecase.execute(body);
    }

    @HttpCode(200)
    @UseGuards(ServerAuthGuard)
    @Post("/change-password")
    changePassword(@Body() body: any) {
        const changeUserPasswordUsecase = new ChangeUserPasswordUsecase(this.prismaService)
        return changeUserPasswordUsecase.execute({ ...body, password: body.password ?? "default" });
    }

    @HttpCode(200)
    @UseGuards(ServerAuthGuard)
    @Post("/get-user-details")
    getUserDetails(@Body() body: any) {
        const getUserDetailsUsecase = new GetUserDetailsUsecase(this.prismaService)
        return getUserDetailsUsecase.execute({ ...body });
    }
}
