import {  ConflictException } from '@nestjs/common';


class ImageUrlIsTheSameError extends ConflictException {
    constructor() {
        super({
            name: "ImageUrlIsTheSameError"
        })
    }
}

export class ChangeImageUrlErrorMapper extends ConflictException {

    static throwError(errorName: string): void {
        if(errorName === "ImageUrlIsTheSameError") throw new ImageUrlIsTheSameError()
        else throw new ConflictException()
    }

  
}
