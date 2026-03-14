import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({ example: 'My Awesome Project', description: 'The name of the project' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
