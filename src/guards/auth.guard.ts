
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthFacade } from 'src/modules/auth/facade';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvalidAccessTokenError, UserBannedError, UserValidationMapper } from './errors';
import { UserSessionFacade } from 'src/modules/user-session/facades';
import { AccessTokenValidationService } from './access-token-validation.service';


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
    
    const accessTokenValidationService = new AccessTokenValidationService(this.prismaService)
    const user = await accessTokenValidationService.validate(accessToken)
    if(user.isFailure()) UserValidationMapper.map(user.value) 

    req.currentUser = user.value

    return true;
  }

  

}