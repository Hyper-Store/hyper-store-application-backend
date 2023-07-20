import {  ConflictException } from '@nestjs/common';


class ServiceAlreadyIsNotInMaintenanceError extends ConflictException {
    constructor() {
        super({
            name: "ServiceAlreadyIsNotInMaintenanceError"
        })
    }
}

export class RemoveMaintananceErrorMapper extends ConflictException {

    static throwError(errorName: string): void {
        if(errorName === "ServiceAlreadyIsNotInMaintenanceError") throw new ServiceAlreadyIsNotInMaintenanceError()
        else throw new ConflictException()
    }

  
}
