import {  ConflictException } from '@nestjs/common';


export class ServiceAlreadyExistsError extends ConflictException {

    constructor(){
        super({
            name: "ServiceAlreadyExistsError"
        })
    }
}
