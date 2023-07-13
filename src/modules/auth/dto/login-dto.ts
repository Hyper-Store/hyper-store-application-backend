import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator"

export class LoginDto {

    @IsNotEmpty({ message: "ValueNotProvidedError" })
    @IsString({ message: "InvalidValueTypeError"})
    value: string

    @IsNotEmpty({ message: "PasswordNotProvidedError" })
    @IsString({ message: "InvalidPasswordTypeError"})
    password: string


}
