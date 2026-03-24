import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty, IsOptional } from "class-validator";
import { RolesProject } from "../entities/role.entity";

export class AddedUserToProjectDTO {
    @ApiProperty({ example: 'johndoe', description: 'Username of the user to be added' })
    @IsAlpha()
    @IsNotEmpty()
    username: string;

    @ApiPropertyOptional({ enum: RolesProject, description: 'Role of the user in the project' })
    @IsOptional()
    role?: RolesProject;
}