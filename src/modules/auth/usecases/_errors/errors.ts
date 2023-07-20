import {  NotFoundException } from '@nestjs/common';


export class UserNotFoundError extends NotFoundException {

    constructor(){
        super({
            name: "UserNotFoundError"
        })
    }
}

export class InvalidAccessTokenError extends NotFoundException {

    constructor(){
        super({
            name: "InvalidAccessTokenError"
        })
    }
}