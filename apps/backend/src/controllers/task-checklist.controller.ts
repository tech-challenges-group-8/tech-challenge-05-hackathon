import { Controller, Post, Body, Param, Patch, Delete, Get } from '@nestjs/common';
import { 
    CreateTaskCheckListUseCase, 
    ListTaskCheckListUseCase, 
    UpdateTaskCheckListUseCase, 
    DeleteTaskCheckListUseCase,
    GetTaskCheckListUseCase,
    TaskCheckList
} from '@mindease/domain';
import { CreateTaskCheckListDTO, ResponseTaskCheckListDTO } from '@mindease/dtos';
import { randomUUID } from 'crypto';

@Controller('tasks')
export class TaskCheckListController {
    constructor(
        private readonly createUseCase: CreateTaskCheckListUseCase,
        private readonly listUseCase: ListTaskCheckListUseCase,
        private readonly updateUseCase: UpdateTaskCheckListUseCase,
        private readonly deleteUseCase: DeleteTaskCheckListUseCase,
        private readonly getUseCase: GetTaskCheckListUseCase,
    ) {}

    @Get()
    async teste() {
        
        return { message: 'Hello World!' };
    }

    @Post()
    async create(@Body() body: CreateTaskCheckListDTO) {
        const id = randomUUID();
        const task = await this.createUseCase.execute({
            id,
            idUser: body.idUser,
            description: body.description
        });
        return this.toResponse(task);
    }

    @Get('user/:idUser')
    async findAll(@Param('idUser') idUser: string) {
        const tasks = await this.listUseCase.execute(idUser);
        return tasks.map(this.toResponse);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const task = await this.getUseCase.execute(id);
        return task ? this.toResponse(task) : null;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: { description?: string, isDone?: boolean }) {
        const task = await this.updateUseCase.execute({
            id,
            description: body.description,
            isDone: body.isDone
        });
        return this.toResponse(task);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.deleteUseCase.execute(id);
        return { message: 'Task deleted successfully' };
    }

    private toResponse(task: TaskCheckList): ResponseTaskCheckListDTO {
        return new ResponseTaskCheckListDTO(
            task.id,
            task.description,
            task.completed,
            task.createdAt,
            task.updatedAt
        );
    }
}