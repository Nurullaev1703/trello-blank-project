import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { Project } from '../entities/project.entity';
import { Task, TaskStatus } from '../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(tokenData: TokenData, createTaskDto: CreateTaskDto) {
    const task = new Task(createTaskDto);

    // If a specific assignee is provided — find them, otherwise assign to the requester
    task.user = await this.userRepository.findOne(
      createTaskDto.username
        ? { where: { username: createTaskDto.username } }
        : { where: { id: tokenData.id } },
    );

    task.project = await this.projectRepository.findOne({
      where: { id: createTaskDto.projectId },
    });

    await this.taskRepository.save({ ...task, status: TaskStatus.create });

    return 'Task created';
  }

  async findByProject(projectId: string) {
    return this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: {
        user: true,    // must be true to JOIN and select user fields
        project: false,
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
        user: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    });
  }

  async updateStatus(taskId: string, dto: UpdateTaskStatusDto) {
    await this.taskRepository.update({ id: taskId }, { status: dto.status });
    return 'Task status updated';
  }
}

