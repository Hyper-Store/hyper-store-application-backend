import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

export class InvalidServerTokenError extends UnauthorizedException {

    constructor(){
        super({
            name: "InvalidServerTokenError"
        })
    }
}


@Injectable()
export class ServerAuthGuard implements CanActivate {

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request & any>();
    
    const serverToken = req.headers.authorization ?? ""
    
    if(serverToken !== process.env.SERVER_TOKEN) throw new InvalidServerTokenError()

    return true;
  }
}