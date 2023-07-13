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
    @Body() body: LoginDto
  ) {
    const loginUsecase = new LoginUsecase(this.prismaService)
    return await loginUsecase.execute(body);
  }

  @HttpCode(200)
  @Post("/refresh-token")
  async refreshToken(
    @Body() body: any, 
  ) {
    const refreshTokenUsecase = new RefreshTokenUsecase()
    return await refreshTokenUsecase.execute({
      refreshToken: body.refreshToken ?? ""
    });
  }

  @HttpCode(200)
  @UseGuards(new AuthGuard())
  @Post("/current-user")
  async currentUser(
    @Req() req: Request
  ) {
    return req.currentUser ?? {}
  }
}
