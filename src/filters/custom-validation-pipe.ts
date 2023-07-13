import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        // Initialize the name to be a generic error name
        let name = "ValidationError";
        for (const error of errors) {
          if (error.constraints) {
            // If there are constraints, take the first one and break the loop
            const firstConstraintKey = Object.keys(error.constraints)[0];
            name = error.constraints[firstConstraintKey];
            break;
          }
        }

        return new BadRequestException({
          name: name,
        });
      },
    });
  }
}
