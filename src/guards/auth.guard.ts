
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { GetCurrentUserUsecase } from 'src/modules/auth/usecases';

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
    const req = ctx.getRequest<Request>();

    const getCurrentUserUsecase = new GetCurrentUserUsecase()
    const user = await getCurrentUserUsecase.execute({
        accessToken: req.headers.authorization ?? ""
    })

    req.currentUser = user

    return true;
  }
}