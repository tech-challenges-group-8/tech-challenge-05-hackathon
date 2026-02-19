import { Controller, Post, Body, Param, Patch, Delete, Get, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { 
    CreateTaskKanbanUseCase, 
    ListTaskKanbanUseCase, 
    UpdateTaskKanbanUseCase, 
    DeleteTaskKanbanUseCase,
    GetTaskKanbanUseCase,
    TaskKanban,
    TaskKanbanStatus,
    TaskKanbanPriority
} from '@mindease/domain';
import { randomUUID } from 'crypto';
import { CreateTaskKanbanDTO, ResponseTaskKanbanDTO, UpdateTaskKanbanDTO } from '@mindease/dtos';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth';

@Controller('task-kanban')
@ApiTags('task-kanban')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskKanbanController {
    constructor(
        private readonly createUseCase: CreateTaskKanbanUseCase,
        private readonly listUseCase: ListTaskKanbanUseCase,
        private readonly updateUseCase: UpdateTaskKanbanUseCase,
        private readonly deleteUseCase: DeleteTaskKanbanUseCase,
        private readonly getUseCase: GetTaskKanbanUseCase,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new kanban task' })
    @ApiBody({ 
        schema: {
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' },
                priority: { type: 'string' },
                dueDate: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } }
            }
        }
     })
    @ApiResponse({ status: 201, description: 'Task created successfully', type: ResponseTaskKanbanDTO })
    async create(@Request() req: any, @Body() body: CreateTaskKanbanDTO) {
        const userId = req.user.sub;
        const task = await this.createUseCase.execute({
            idUser: userId,
            title: body.title,
            description: body.description,
            status: body.status as TaskKanbanStatus || TaskKanbanStatus.Todo,
            priority: body.priority as TaskKanbanPriority || TaskKanbanPriority.Low,
            dueDate: body.dueDate,
            tags: body.tags
        });
        return this.toResponse(task);
    }

    @Get()
    @ApiOperation({ summary: 'List all kanban tasks for the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of tasks', type: [ResponseTaskKanbanDTO] })
    async findAll(@Request() req: any) {
        const userId = req.user.sub;
        const tasks = await this.listUseCase.execute(userId);
        return tasks.map(this.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a kanban task by ID' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Task found', type: ResponseTaskKanbanDTO })
    @ApiResponse({ status: 404, description: 'Task not found' })
    async findOne(@Param('id') id: string) {
        const task = await this.getUseCase.execute(id);
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return this.toResponse(task);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a kanban task' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ 
        schema: {
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' },
                priority: { type: 'string' },
                dueDate: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } }
            }
        }
     })
    @ApiResponse({ status: 200, description: 'Task updated successfully', type: ResponseTaskKanbanDTO })
    async update(@Param('id') id: string, @Body() body: UpdateTaskKanbanDTO) {
        const task = await this.updateUseCase.execute({
            id,
            title: body.title,
            description: body.description,
            status: body.status as TaskKanbanStatus
        });
        return this.toResponse(task);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a kanban task' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Task deleted successfully' })
    async delete(@Param('id') id: string) {
        await this.deleteUseCase.execute(id);
        return { message: 'Task deleted successfully' };
    }

    private toResponse(task: TaskKanban): ResponseTaskKanbanDTO {
        return new ResponseTaskKanbanDTO(
            task.id,
            task.idUser,
            task.title,
            task.description,
            task.status,
            task.priority,
            task.dueDate,
            task.createdAt,
            task.updatedAt,
            task.tags
        );
    }
}
