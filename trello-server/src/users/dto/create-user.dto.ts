import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'John', description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
    
    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
    
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
