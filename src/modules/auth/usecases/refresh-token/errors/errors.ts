import { BadRequestException } from '@nestjs/common';

export class InvalidRefreshTokenError extends BadRequestException {

    constructor(){
        super({
            name: "InvalidRefreshTokenError"
        })
    }
}