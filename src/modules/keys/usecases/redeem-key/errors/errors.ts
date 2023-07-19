import {  NotFoundException, ConflictException } from '@nestjs/common';


export class KeyNotActivatedError extends NotFoundException {

    constructor(){
        super({
            name: "KeyNotActivatedError"
        })
    }
}


export class SignatureAlreadyActiveError extends ConflictException {

    constructor(){
        super({
            name: "SignatureAlreadyActiveError"
        })
    }
}
