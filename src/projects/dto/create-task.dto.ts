import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement login page', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2024-03-20T09:00:00Z', description: 'Task start date (ISO 8601)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-03-25T18:00:00Z', description: 'Task end date (ISO 8601)' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 'johndoe', description: 'Username to assign the task to. Defaults to the current user.' })
  @IsOptional()
  @IsString()
  username?: string;

  // Injected internally from the URL — not exposed in Swagger body
  @ApiHideProperty()
  projectId?: string;
}

