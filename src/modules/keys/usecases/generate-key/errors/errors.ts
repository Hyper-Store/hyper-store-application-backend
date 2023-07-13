import {  NotFoundException } from '@nestjs/common';


export class ServiceNotFoundError extends NotFoundException {

    constructor(){
        super({
            name: "ServiceNotFoundError"
        })
    }
}
