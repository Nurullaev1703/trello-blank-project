import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { TasksService } from './tasks.service';
import { GetTasksReponse } from '../response/get-tasks-response';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new task', description: 'Creates a new task in a project.' })
    @ApiOkResponse({ description: 'Task successfully created.' })
    create(@Request() req: AuthRequest, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(req.user, createTaskDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks', description: 'Returns all tasks across all projects with optional filtering.' })
    @ApiOkResponse({ type: GetTasksReponse, description: 'List of tasks.' })
    findAll(@Query() filters: GetTasksFilterDto) {
        return this.tasksService.findAll(filters);
    }
    
    @Get('/my')
    @ApiOperation({ summary: 'Get current user tasks', description: 'Returns tasks assigned to or created by the current authenticated user.' })
    @ApiOkResponse({ type: GetTasksReponse, description: 'List of user tasks.' })
    findMy(@Query() filters: GetTasksFilterDto, @Request() req: AuthRequest){
        return this.tasksService.findAll(filters, req.user);
    }
}