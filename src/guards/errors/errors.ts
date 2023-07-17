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
      case "InvalidAccessTokenError": return new InvalidAccessTokenError()
      case "UserBannedError": return new UserBannedError()
      default: return new InvalidAccessTokenError()
    }
  }
}