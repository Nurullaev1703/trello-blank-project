import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../entities/task.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiPropertyOptional({ enum: TaskStatus, description: 'The current status of the task' })
    status?: TaskStatus;
}
