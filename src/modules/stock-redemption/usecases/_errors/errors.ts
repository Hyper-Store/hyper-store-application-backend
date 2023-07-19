import {  BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';


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

export class ServiceTypeNotAccountGeneratorError extends NotFoundException {
    constructor() {
        super({
            name: "ServiceTypeNotAccountGeneratorError"
        })
    }
}

export class SignatureNotFoundUserError extends UnauthorizedException {
    constructor() {
        super({
            name: "SignatureNotFoundUserError"
        })
    }
}

export class MaxStockRedemptionReachedError extends UnauthorizedException {
    constructor() {
        super({
            name: "MaxStockRedemptionReachedError"
        })
    }
}


