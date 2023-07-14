import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator"

export class UpdateNameDto {

    @IsNotEmpty({ message: "NameNotProvidedError" })
    @IsString({ message: "InvalidNameTypeError"})
    name: string
}
