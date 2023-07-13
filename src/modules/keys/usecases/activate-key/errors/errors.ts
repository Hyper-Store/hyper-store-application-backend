import {  ConflictException } from '@nestjs/common';


export class KeyAlreadyActivatedError extends ConflictException {

    constructor(){
        super({
            name: "KeyAlreadyActivatedError"
        })
    }
}
