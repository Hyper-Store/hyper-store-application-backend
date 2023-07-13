import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator"

export class CreateServiceDto {

    @IsNotEmpty({ message: "NameNotProvidedError" })
    @IsString({ message: "InvalidNameTypeError"})
    name: string

    @IsNotEmpty({ message: "NameNotProvidedError" })
    @IsString({ message: "InvalidNameTypeError"})
    imageUrl: string
}
