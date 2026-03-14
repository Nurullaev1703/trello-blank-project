import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsAlpha, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement login', description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2024-03-20T09:00:00Z', description: 'Task start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-03-25T18:00:00Z', description: 'Task end date' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 'john_doe', description: 'Assignee username' })
  @IsOptional()
  @IsAlpha()
  username?: string;

  @ApiProperty({ example: 'project-uuid-123', description: 'Project ID where the task belongs' })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
