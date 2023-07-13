
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserSectionService } from 'src/modules/user-section/user-section.service';
import { AuthFacade } from 'src/modules/auth/facade';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvalidAccessTokenError, UserBannedError } from './errors';


interface User {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly prismaService: PrismaService
  ){}

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request & any>();

    const accessToken = req.headers.authorization ?? ""
    const user = await this.validateAccessToken(accessToken)

    await this.validateUserBanned(user.userId)

    req.currentUser = user

    return true;
  }

  async validateAccessToken(accessToken: string){
    const user = await UserSectionService.verifySection(accessToken)
    if(!user) throw new InvalidAccessTokenError()
    return user
  }

  async validateUserBanned(userId: string){
    const authFacade = new AuthFacade(this.prismaService)
    const isUserBanned = await authFacade.isUserBanned(userId)
    if(isUserBanned) throw new UserBannedError()
  }


}