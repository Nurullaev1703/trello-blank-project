import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
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

    task.user = await this.userRepository.findOne(
      createTaskDto.username 
      ? {
        where:{
          username: createTaskDto.username
        }
      }
      : {
        where:{
          id: tokenData.id
        }
      }
    )

    task.project = await this.projectRepository.findOne({
      where: { id: createTaskDto.projectId },
    });

    await this.taskRepository.save({...task, status: TaskStatus.create})

    return 'Задача добавлена в проект';
  }

  async findAll(filters: GetTasksFilterDto, tokenData?: TokenData) {
    let where:FindOptionsWhere<Task> = {}

    if(filters.username || tokenData){
      where = {...where, user: tokenData ? {id:tokenData.id} : {username: filters.username}}
    }

    if(filters.projectId){
      where = {...where, project:{ id: filters.projectId}}
    }

    return this.taskRepository.find({
      relations:{
        project: true,
      },
      select:{
        user:{
          username:true,
          firstName:true,
          lastName:true
        }
      },
      where
    })
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = new Task(updateTaskDto);
    await this.taskRepository.save({ id, ...task });
    return 'Задача обновлена';
  }

  async remove(id: string) {
    await this.taskRepository.delete({ id });
    return 'Задача удалена';
  }
}
