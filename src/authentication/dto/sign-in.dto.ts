import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({ example: 'johndoe', description: 'User unique username' })
    @IsAlpha()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
