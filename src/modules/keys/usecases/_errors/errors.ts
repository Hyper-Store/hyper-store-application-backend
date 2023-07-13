import {  NotFoundException, ConflictException } from '@nestjs/common';


export class KeyNotFoundError extends NotFoundException {

    constructor(){
        super({
            name: "KeyNotFoundError"
        })
    }
}


export class KeyIsRedeemedError extends ConflictException {

    constructor(){
        super({
            name: "KeyIsRedeemedError"
        })
    }
}
