import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length, IsNumber } from "class-validator"

export class CreateKeyDto {

    @IsNotEmpty({ message: "ServiceIdNotProvidedError" })
    @IsString({ message: "InvalidServiceIdTypeError"})
    serviceId: string

    @IsNotEmpty({ message: "NameNotProvidedError" })
    @IsNumber({  },{ message: "InvalidValidUntilTypeError"})
    validUntil: number

    @IsNotEmpty({ message: "QuantityNotProvidedError" })
    @IsNumber({  },{ message: "InvalidQuantityTypeError"})
    quantity: number
}
