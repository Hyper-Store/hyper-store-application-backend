import {  NotFoundException } from '@nestjs/common';


export class KeyNotFoundError extends NotFoundException {

    constructor(){
        super({
            name: "KeyNotFoundError"
        })
    }
}
