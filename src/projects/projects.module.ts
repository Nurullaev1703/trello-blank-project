import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Task } from './entities/task.entity';
import { Role } from './entities/role.entity';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Task, Role])],
  controllers: [ProjectsController],
  providers: [ProjectsService, TasksService],
})
export class ProjectsModule {}
