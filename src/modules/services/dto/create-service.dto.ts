import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator"

export class CreateServiceDto {

    @IsNotEmpty({ message: "NameNotProvidedError" })
    @IsString({ message: "InvalidNameTypeError"})
    name: string

    @IsNotEmpty({ message: "ImageUrlNotProvidedError" })
    @IsString({ message: "InvalidImageUrlTypeError"})
    imageUrl: string

    @IsNotEmpty({ message: "typeNotProvidedError" })
    @IsString({ message: "InvalidTypeTypeError"})
    type: string
}
