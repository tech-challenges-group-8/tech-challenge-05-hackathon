export type TaskKanbanStatus = 'todo' | 'in-progress' | 'done';
export type TaskKanbanPriority = 'low' | 'medium' | 'high';

export interface TaskKanban {
  id: string;
  title: string;
  description: string;
  status: TaskKanbanStatus;
  priority: TaskKanbanPriority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskKanbanDTO {
  title: string;
  description: string;
  status?: TaskKanbanStatus;
  priority?: TaskKanbanPriority;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskKanbanDTO {
  title?: string;
  description?: string;
  status?: TaskKanbanStatus;
  priority?: TaskKanbanPriority;
  dueDate?: string;
  tags?: string[];
}

export interface ResponseTaskKanbanDTO {
  id: string;
  title: string;
  description: string;
  status: TaskKanbanStatus;
  priority: TaskKanbanPriority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
}
