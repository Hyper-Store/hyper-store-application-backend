import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Res, Req, HttpCode, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { 
  SignupUsecase,
  LoginUsecase, 
  RefreshTokenUsecase
} from './usecases';
import { Response, Request } from "express"
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto';
import { AuthGuard } from 'src/guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  @Post("/signup")
  create(@Body() body: CreateUserDto) {
    const signupUsecase = new SignupUsecase(this.prismaService)
    return signupUsecase.execute(body);
  }

  @HttpCode(200)
  @Post("/login")
  async login(
    @Body() body: LoginDto,
    @Req() req: Request
  ) {
    const loginUsecase = new LoginUsecase(this.prismaService)
    const result = await loginUsecase.execute({
      ...body,
      ip: req.ip,
      userAgent: req.headers["user-agent"] ?? ""
    });
    return result
  }

  @HttpCode(200)
  @Post("/refresh-token")
  async refreshToken(
    @Body() body: any, 
    @Req() req: Request
  ) {
    const refreshTokenUsecase = new RefreshTokenUsecase(this.prismaService)
    const result = await refreshTokenUsecase.execute({
      refreshToken: body.refreshToken ?? "",
      ip: req.ip,
      userAgent: req.headers["user-agent"] ?? ""
    });

 
    return result
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Post("/current-user")
  async currentUser(
    @Req() req: Request
  ) {
    return req.currentUser ?? {}
  }
}
