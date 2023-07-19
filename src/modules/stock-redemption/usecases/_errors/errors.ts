import {  BadRequestException, NotFoundException } from '@nestjs/common';


export class OutOfStockError extends BadRequestException {
    constructor() {
        super({
            name: "OutOfStockError"
        })
    }
}

export class SignatureNotFoundError extends NotFoundException {
    constructor() {
        super({
            name: "SignatureNotFoundError"
        })
    }
}

export class ServiceTypeNotAccounceGeneratorError extends NotFoundException {
    constructor() {
        super({
            name: "ServiceTypeNotAccounceGeneratorError"
        })
    }
}



