import {  ConflictException } from '@nestjs/common';


export class KeyAlreadyDisabledError extends ConflictException {

    constructor(){
        super({
            name: "KeyAlreadyDisabledError"
        })
    }
}
