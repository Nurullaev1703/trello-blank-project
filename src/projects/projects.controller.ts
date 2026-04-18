import { Controller, Get, Post, Body, Patch, Param, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetProjectFindAllResponse } from './response/get-project-find-all.response';
import { GetParticipantsResponse } from './response/get-participants-response';
import { GetMembersResponse } from './response/get-members-response';
import { AddedUserToProjectDTO } from './dto/added-user-to-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksReponse } from './response/get-tasks-response';
import { TasksService } from './tasks/tasks.service';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  // ─── Projects ───────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created.' })
  create(@Request() req: AuthRequest, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(req.user, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects of the current user' })
  @ApiOkResponse({ type: GetProjectFindAllResponse, isArray: true })
  findAll(@Request() req: AuthRequest) {
    return this.projectsService.findAll(req.user);
  }

  // ─── Members ────────────────────────────────────────────────

  @Get(':id/members')
  @ApiOperation({ summary: 'Get project members' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({ type: GetMembersResponse, isArray: true })
  findMembers(@Param('id') id: string) {
    return this.projectsService.findMembers(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a user to the project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 201, description: 'User successfully added.' })
  addMember(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: AddedUserToProjectDTO,
  ) {
    return this.projectsService.addedUserToProject(id, req.user, dto);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get users not yet in the project (for search/add UI)' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({ type: GetParticipantsResponse, isArray: true })
  findParticipants(@Param('id') id: string) {
    return this.projectsService.findParticipants(id);
  }

  // ─── Tasks ──────────────────────────────────────────────────

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get all tasks of a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({ type: GetTasksReponse, isArray: true })
  getProjectTasks(@Param('id') id: string) {
    return this.tasksService.findByProject(id);
  }

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create a task in a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 201, description: 'Task successfully created.' })
  createTask(
    @Param('id') projectId: string,
    @Request() req: AuthRequest,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(req.user, { ...dto, projectId });
  }

  @Patch(':id/tasks/:taskId')
  @ApiOperation({ summary: 'Update task status' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task status updated.' })
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(taskId, dto);
  }
}

