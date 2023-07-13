import { BadRequestException } from '@nestjs/common';


export class InvalidCredentialsError extends BadRequestException {

    constructor(){
        super({
            name: "InvalidCredentialsError"
        })
    }
}