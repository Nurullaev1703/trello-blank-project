import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: ['user-uuid-1', 'user-uuid-2'], description: 'List of user IDs to be associated with the project', type: [String] })
  @IsArray()
  @IsString({each:true})
  @ArrayMinSize(0)
  users: string[];

  @ApiPropertyOptional({ example: 'Updated Project Name', description: 'New name for the project' })
  @IsOptional()
  @IsString()
  name?: string;
}
