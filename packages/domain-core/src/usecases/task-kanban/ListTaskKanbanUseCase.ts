import { TaskKanban } from '../../entities/task-kanban/TaskKanban';
import { ITaskKanbanRepository } from '../../repositories/ITaskKanbanRepository';

export class ListTaskKanbanUseCase {
  constructor(private readonly repository: ITaskKanbanRepository) {}

  async execute(idUser: string): Promise<TaskKanban[]> {
    return this.repository.findByUser(idUser);
  }
}
