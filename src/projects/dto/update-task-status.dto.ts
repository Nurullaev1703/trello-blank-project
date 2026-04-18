import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskStatusDto {
  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.inProgress,
    description: 'New status for the task',
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
