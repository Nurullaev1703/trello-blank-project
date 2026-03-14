import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    
    @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'johndoe', description: 'Unique username' })
    @IsAlpha()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'password123', description: 'Password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
