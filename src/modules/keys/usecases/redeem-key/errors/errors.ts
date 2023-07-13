import {  NotFoundException } from '@nestjs/common';


export class KeyNotActivatedError extends NotFoundException {

    constructor(){
        super({
            name: "KeyNotActivatedError"
        })
    }
}
