import {  NotFoundException } from '@nestjs/common';


export class KeyAlreadyRedeemedError extends NotFoundException {

    constructor(){
        super({
            name: "KeyAlreadyRedeemedError"
        })
    }
}
