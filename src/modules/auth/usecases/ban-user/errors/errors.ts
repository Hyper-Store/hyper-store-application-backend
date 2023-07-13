import {  ConflictException } from '@nestjs/common';


export class UserAlreadyBannedError extends ConflictException {

    constructor(){
        super({
            name: "UserAlreadyBannedError"
        })
    }
}

