import {  ConflictException } from '@nestjs/common';


class NameIsTheSameError extends ConflictException {
    constructor() {
        super({
            name: "NameIsTheSameError"
        })
    }
}

export class ChangeNameErrorMapper extends ConflictException {

    static throwError(errorName: string): void {
        if(errorName === "NameIsTheSameError") throw new NameIsTheSameError()
        else throw new ConflictException()
    }

  
}
