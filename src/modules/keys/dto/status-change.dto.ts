import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length, IsNumber } from "class-validator"

export class StatusChangeDto {

    @IsNotEmpty({ message: "KeyIdNotProvidedError" })
    @IsString({ message: "InvalidKeyTypeError"})
    key: string

}
