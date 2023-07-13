import {  ConflictException } from '@nestjs/common';


export class UserAlreadyUnBannedError extends ConflictException {

    constructor(){
        super({
            name: "UserAlreadyUnBannedError"
        })
    }
}

