import {  NotFoundException, ConflictException } from '@nestjs/common';


export class ServiceNotFoundError extends NotFoundException {

    constructor(){
        super({
            name: "ServiceNotFoundError"
        })
    }
}


export class ServiceNameAlreadyInUseError extends NotFoundException {

    constructor(){
        super({
            name: "ServiceNameAlreadyInUseError"
        })
    }
}
