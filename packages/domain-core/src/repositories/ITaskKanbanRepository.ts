import { TaskKanban } from '../entities/task-kanban/TaskKanban';

export interface ITaskKanbanRepository {
  save(task: TaskKanban): Promise<void>;
  findById(id: string): Promise<TaskKanban | null>;
  findByUser(idUser: string): Promise<TaskKanban[]>;
  update(task: TaskKanban): Promise<void>;
  delete(id: string): Promise<void>;
}
