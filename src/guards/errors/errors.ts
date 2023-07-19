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


export class UserValidationMapper {

  static map(error: string): InvalidAccessTokenError | UserBannedError {
    switch(error){
      case "InvalidAccessTokenError": throw new InvalidAccessTokenError()
      case "UserBannedError": throw new UserBannedError()
      default: throw new InvalidAccessTokenError()
    }
  }
}