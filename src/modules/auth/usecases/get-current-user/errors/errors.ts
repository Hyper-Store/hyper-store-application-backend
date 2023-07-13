import {  UnauthorizedException } from '@nestjs/common';


export class InvalidAccessTokenError extends UnauthorizedException {

    constructor(){
        super({
            name: "InvalidAccessTokenError"
        })
    }
}