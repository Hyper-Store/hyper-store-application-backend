import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Res, Req, HttpCode, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { 
  SignupUsecase,
  LoginUsecase, 
  RefreshTokenUsecase,
  LogoutUsecase,

} from './usecases';
import { Response, Request } from "express"
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { LoginDto } from './dto';
import { AuthGuard } from 'src/guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  @Post("/signup")
  async create(
    @Body() body: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const signupUsecase = new SignupUsecase(this.prismaService)
    const { accessToken, refreshToken, id } = await signupUsecase.execute({
      ...body,
      ip: req.ip,
      userAgent: req.headers["user-agent"] ?? ""
    });
    res.cookie("refreshToken", refreshToken, )
    res.cookie("accessToken", accessToken,)
    res.json({ id })
  }

  @HttpCode(200)
  @Post("/login")
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const loginUsecase = new LoginUsecase(this.prismaService)
    const { accessToken, refreshToken }  = await loginUsecase.execute({
      ...body,
      ip: req.ip,
      userAgent: req.headers["user-agent"] ?? ""
    });
    res.cookie("refreshToken", refreshToken, )
    res.cookie("accessToken", accessToken, )
    res.json()
  }

  @HttpCode(200)
  @Post("/refresh-token")
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const refreshTokenUsecase = new RefreshTokenUsecase(this.prismaService)
    const { accessToken, refreshToken } = await refreshTokenUsecase.execute({
      refreshToken: req.cookies?.refreshToken ?? "",
      ip: req.ip ?? "",
      userAgent: req.headers["user-agent"] ?? ""
    });
    res.cookie("refreshToken", refreshToken, )
    res.cookie("accessToken", accessToken, )
    res.json()
  }

  @HttpCode(200)
  @Post("/logout")
  async logout(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const logoutUsecase = new LogoutUsecase(this.prismaService)
     await logoutUsecase.execute({
      accessToken: req.cookies?.accessToken ?? ""
    });
    res.clearCookie("refreshToken")
    res.clearCookie("accessToken" )
    res.json()
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
