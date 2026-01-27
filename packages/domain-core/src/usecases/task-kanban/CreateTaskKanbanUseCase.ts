import { randomUUID } from 'crypto';
import { TaskKanban } from '../../entities/task-kanban/TaskKanban';
import { ITaskKanbanRepository } from '../../repositories/ITaskKanbanRepository';
import { TaskKanbanStatus } from '../../entities/task-kanban/enums/TaskKanbanStatusEnum';
import { TaskKanbanPriority } from '../../entities/task-kanban/enums/TaskKanbanPriorityEnum';

export interface CreateTaskKanbanInput {
  idUser: string;
  title: string;
  description?: string;
  status?: TaskKanbanStatus;
  priority?: TaskKanbanPriority;
  dueDate?: Date;
  tags?: string[];
}

export class CreateTaskKanbanUseCase {
  constructor(private readonly repository: ITaskKanbanRepository) {}

  async execute(input: CreateTaskKanbanInput): Promise<TaskKanban> {
    const task = new TaskKanban(
      randomUUID(),
      input.idUser,
      input.title,
      input.status,
      input.priority
    );

    if (input.description) task.updateDescription(input.description);
    if (input.dueDate) task.setDueDate(input.dueDate);
    if (input.tags) task.setTags(input.tags);

    await this.repository.save(task);
    return task;
  }
}
