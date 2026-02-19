import { TaskKanban } from '../../entities/task-kanban/TaskKanban';
import { ITaskKanbanRepository } from '../../repositories/ITaskKanbanRepository';

export class GetTaskKanbanUseCase {
  constructor(private readonly repository: ITaskKanbanRepository) {}

  async execute(id: string): Promise<TaskKanban | null> {
    return this.repository.findById(id);
  }
}
