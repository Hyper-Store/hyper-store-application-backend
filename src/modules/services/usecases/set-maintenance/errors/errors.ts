import {  ConflictException } from '@nestjs/common';


class ServiceAlreadyIsInMaintenanceError extends ConflictException {
    constructor() {
        super({
            name: "ServiceAlreadyIsInMaintenanceError"
        })
    }
}

export class SetMaintananceErrorMapper extends ConflictException {

    static throwError(errorName: string): void {
        if(errorName === "ServiceAlreadyIsInMaintenanceError") throw new ServiceAlreadyIsInMaintenanceError()
        else throw new ConflictException()
    }

  
}
