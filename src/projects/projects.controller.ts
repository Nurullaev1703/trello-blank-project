import { Controller, Get, Post, Body, Patch, Param, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetProjectFindAllResponse } from './response/get-project-find-all.response';
import { GetParticipantsResponse } from './response/get-participants-response';
import { GetMembersResponse } from './response/get-members-response';
import { AddedUserToProjectDTO } from './dto/added-user-to-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project', description: 'Creates a new project for the authenticated user.' })
  @ApiResponse({ status: 201, description: 'Project successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Request() req: AuthRequest,
    @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(req.user, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects', description: 'Returns all projects belonging to the authenticated user.' })
  @ApiOkResponse({ type: GetProjectFindAllResponse, description: 'List of projects.' })
  findAll(@Request() req: AuthRequest) {
    return this.projectsService.findAll(req.user);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get project participants', description: 'Returns a list of participants for the specified project.' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the project' })
  @ApiOkResponse({ type: GetParticipantsResponse, description: 'List of participants.' })
  findParticipants(@Param('id') id: string) {
    return this.projectsService.findParticipants(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get project members', description: 'Returns a list of members who have access to the specified project.' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the project' })
  @ApiOkResponse({ type: GetMembersResponse, description: 'List of members.' })
  findMembers(@Param('id') id: string) {
    return this.projectsService.findMembers(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a user to a project', description: 'Adds a new user as a member to the specified project.' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the project' })
  @ApiResponse({ status: 201, description: 'User successfully added to the project.' })
  addedUserToProject(
    @Param("id") id: string,
    @Request() req: AuthRequest,
    @Body() dto: AddedUserToProjectDTO
  ) {
    return this.projectsService.addedUserToProject(id, req.user, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project', description: 'Updates the details of an existing project.' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the project' })
  @ApiResponse({ status: 200, description: 'Project successfully updated.' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }
}
