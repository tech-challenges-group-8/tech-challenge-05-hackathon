import { Controller, Post, Body, Param, Patch, Delete, Get, UseGuards, Request, NotFoundException } from '@nestjs/common';
import {
    CreateTaskCheckListUseCase,
    ListTaskCheckListUseCase,
    UpdateTaskCheckListUseCase,
    DeleteTaskCheckListUseCase,
    GetTaskCheckListUseCase,
    TaskCheckList
} from '@mindease/domain';
import { randomUUID } from 'crypto';
import { CreateTaskCheckListDto, ResponseTaskCheckListDto } from '@mindease/dtos';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth';

@Controller('task-checklist')
@ApiTags('task-checklist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskCheckListController {
    constructor(
        private readonly createUseCase: CreateTaskCheckListUseCase,
        private readonly listUseCase: ListTaskCheckListUseCase,
        private readonly updateUseCase: UpdateTaskCheckListUseCase,
        private readonly deleteUseCase: DeleteTaskCheckListUseCase,
        private readonly getUseCase: GetTaskCheckListUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new checklist task' })
    @ApiBody({
        schema: {
            properties: {
                description: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Task created successfully', type: ResponseTaskCheckListDto })
    async create(
        @Request() req: any, @Body() body: CreateTaskCheckListDto) {
        const id = randomUUID();
        const userId = req.user.sub;
        const task = await this.createUseCase.execute({
            id,
            idUser: userId,
            description: body.description
        });
        return this.toResponse(task);
    }

    @Get()
    @ApiOperation({ summary: 'List all checklist tasks for the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of tasks', type: [ResponseTaskCheckListDto] })
    async findAll(@Request() req: any) {
        const userId = req.user.sub;
        const tasks = await this.listUseCase.execute(userId);
        return tasks.map(this.toResponse);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a checklist task by ID' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Task found', type: ResponseTaskCheckListDto })
    @ApiResponse({ status: 404, description: 'Task not found' })
    async findOne(@Param('id') id: string) {
        const task = await this.getUseCase.execute(id);
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return this.toResponse(task);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a checklist task' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ schema: { properties: { description: { type: 'string' }, isDone: { type: 'boolean' } } } })
    @ApiResponse({ status: 200, description: 'Task updated successfully', type: ResponseTaskCheckListDto })
    async update(@Param('id') id: string, @Body() body: { description?: string, isDone?: boolean }) {
        const task = await this.updateUseCase.execute({
            id,
            description: body.description,
            isDone: body.isDone
        });
        return this.toResponse(task);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a checklist task' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Task deleted successfully' })
    async delete(@Param('id') id: string) {
        await this.deleteUseCase.execute(id);
        return { message: 'Task deleted successfully' };
    }

    private toResponse(task: TaskCheckList): ResponseTaskCheckListDto {
        return new ResponseTaskCheckListDto(
            task.id,
            task.description,
            task.completed,
            task.createdAt,
            task.updatedAt
        );
    }
}