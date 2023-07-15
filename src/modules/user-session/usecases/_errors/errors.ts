import {  NotFoundException, ConflictException } from '@nestjs/common';


export class UserSessionNotFoundError extends NotFoundException {

    constructor(){
        super({
            name: "UserSessionNotFoundError"
        })
    }
}
