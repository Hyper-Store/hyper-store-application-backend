import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length, Matches } from "class-validator"

export class CreateUserDto {

    @IsNotEmpty({ message: "EmailNotProvidedError" })
    @IsEmail({}, { message: "InvalidEmailError" })
    email: string

    @IsNotEmpty({ message: "PasswordNotProvidedError" })
    @IsStrongPassword({},{ message: "PasswordNotStrongEnoughError" })
    @Length(8, 70, { message: "InvalidPasswordLengthError" })
    password: string

    @IsNotEmpty({ message: "UsernameNotProvidedError" })
    @IsString({ message: "InvalidUsernameTypeError"})
    @Length(5, 20, { message: "InvalidUsernameLengthError" })
    @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
        message: 'invalidUsernameFormatError',
      })
    username: string
}
