import { TaskKanban } from '../../entities/task-kanban/TaskKanban';
import { ITaskKanbanRepository } from '../../repositories/ITaskKanbanRepository';
import { TaskKanbanStatus } from '../../entities/task-kanban/enums/TaskKanbanStatusEnum';
import { TaskKanbanPriority } from '../../entities/task-kanban/enums/TaskKanbanPriorityEnum';

export interface UpdateTaskKanbanInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskKanbanStatus;
  priority?: TaskKanbanPriority;
  dueDate?: Date;
  tags?: string[];
}

export class UpdateTaskKanbanUseCase {
  constructor(private readonly repository: ITaskKanbanRepository) {}

  async execute(input: UpdateTaskKanbanInput): Promise<TaskKanban> {
    const task = await this.repository.findById(input.id);

    if (!task) {
      throw new Error('Task not found');
    }

    if (input.title !== undefined) task.updateTitle(input.title);
    if (input.description !== undefined) task.updateDescription(input.description);
    if (input.status !== undefined) task.changeStatus(input.status);
    if (input.priority !== undefined) task.changePriority(input.priority);
    if (input.dueDate !== undefined) task.setDueDate(input.dueDate);
    if (input.tags !== undefined) task.setTags(input.tags);

    await this.repository.update(task);
    return task;
  }
}
