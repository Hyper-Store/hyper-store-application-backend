
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserSectionService } from 'src/modules/user-section/user-section.service';
import {  UnauthorizedException } from '@nestjs/common';

export class InvalidAccessTokenError extends UnauthorizedException {

    constructor(){
        super({
            name: "InvalidAccessTokenError"
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

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request & any>();
    
    const accessToken = req.headers.authorization ?? ""
    const user = await UserSectionService.verifySection(accessToken)
    if(!user) throw new InvalidAccessTokenError()

    req.currentUser = user

    return true;
  }
}