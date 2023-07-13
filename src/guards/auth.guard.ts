
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserSectionService } from 'src/modules/user-section/user-section.service';
import {  UnauthorizedException } from '@nestjs/common';
import { PrismaUserRepository } from 'src/modules/auth/repositories';
import { AuthFacade } from 'src/modules/auth/facade';
import { PrismaService } from 'src/prisma/prisma.service';

export class InvalidAccessTokenError extends UnauthorizedException {

    constructor(){
        super({
            name: "InvalidAccessTokenError"
        })
    }
}


export class UserBannedError extends UnauthorizedException {

  constructor(){
      super({
          name: "UserBannedError"
      })
  }
}


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
    const user = await UserSectionService.verifySection(accessToken)
    if(!user) throw new InvalidAccessTokenError()

    const authFacade = new AuthFacade(this.prismaService!)
    const isUserBanned = await authFacade.isUserBanned(user.userId)
    if(isUserBanned) throw new UserBannedError()

    req.currentUser = user

    return true;
  }

}