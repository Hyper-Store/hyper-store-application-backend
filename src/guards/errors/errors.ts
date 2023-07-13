import { UnauthorizedException, ForbiddenException } from "@nestjs/common"

export class InvalidAccessTokenError extends UnauthorizedException {

    constructor(){
        super({
            name: "InvalidAccessTokenError"
        })
    }
}


export class UserBannedError extends ForbiddenException {

  constructor(){
      super({
          name: "UserBannedError"
      })
  }
}
