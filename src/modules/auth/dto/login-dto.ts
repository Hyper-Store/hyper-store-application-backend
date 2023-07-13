import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator"

export class LoginDto {

    @IsNotEmpty({ message: "EmailNotProvidedError" })
    @IsString({ message: "InvalidEmailTypeError"})
    email: string

    @IsNotEmpty({ message: "PasswordNotProvidedError" })
    @IsString({ message: "InvalidPasswordTypeError"})
    password: string


}
