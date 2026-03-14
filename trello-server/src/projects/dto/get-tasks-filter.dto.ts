import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsAlpha, IsOptional, IsString } from "class-validator";

export class GetTasksFilterDto {
  @ApiPropertyOptional({ example: 'johndoe', description: 'Filter tasks by assignee username' })
  @IsOptional()
  @IsAlpha()
  username?: string;

  @ApiPropertyOptional({ example: 'project-uuid-123', description: 'Filter tasks by project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;
}
