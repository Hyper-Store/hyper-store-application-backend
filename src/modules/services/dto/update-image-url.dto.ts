import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator"

export class UpdateImageUrlDto {

    @IsNotEmpty({ message: "ImageUrlNotProvidedError" })
    @IsString({ message: "InvalidImageUrlTypeError"})
    imageUrl: string
}
