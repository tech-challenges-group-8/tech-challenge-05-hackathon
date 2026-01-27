import { ITaskKanbanRepository } from '../../repositories/ITaskKanbanRepository';

export class DeleteTaskKanbanUseCase {
  constructor(private readonly repository: ITaskKanbanRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
