import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator"

export class UserIdDto {

    @IsNotEmpty({ message: "UserIdNotProvidedError" })
    @IsString({ message: "InvalidUserIdTypeError"})
    userId: string


}
