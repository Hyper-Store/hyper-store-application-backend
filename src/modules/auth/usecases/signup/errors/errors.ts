import {  ConflictException } from '@nestjs/common';


export class EmailAlreadyRegisteredError extends ConflictException {

    constructor(){
        super({
            name: "EmailAlreadyRegisteredError"
        })
    }
}

export class UsernameAlreadyRegisteredError extends ConflictException {

    constructor(){
        super({
            name: "UsernameAlreadyRegisteredError"
        })
    }
}