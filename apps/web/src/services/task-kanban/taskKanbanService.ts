import api from '../api';
import type {
  CreateTaskKanbanDTO,
  UpdateTaskKanbanDTO,
  ResponseTaskKanbanDTO,
  TaskKanbanStatus,
  TaskKanbanPriority,
} from './types';

class TaskKanbanService {
  /**
   * Create a new kanban task
   * @param data - Task creation data
   * @returns Created task
   */
  async createTask(data: CreateTaskKanbanDTO): Promise<ResponseTaskKanbanDTO> {
    const response = await api.post<ResponseTaskKanbanDTO>(
      '/task-kanban',
      data
    );
    return response.data;
  }

  /**
   * List all kanban tasks for authenticated user
   * @returns Array of tasks
   */
  async listTasks(): Promise<ResponseTaskKanbanDTO[]> {
    const response = await api.get<ResponseTaskKanbanDTO[]>('/task-kanban');
    return response.data;
  }

  /**
   * Get a kanban task by ID
   * @param id - Task ID
   * @returns Task information
   */
  async getTask(id: string): Promise<ResponseTaskKanbanDTO> {
    const response = await api.get<ResponseTaskKanbanDTO>(`/task-kanban/${id}`);
    return response.data;
  }

  /**
   * Update a kanban task
   * @param id - Task ID
   * @param data - Task data to update
   * @returns Updated task
   */
  async updateTask(
    id: string,
    data: UpdateTaskKanbanDTO
  ): Promise<ResponseTaskKanbanDTO> {
    const response = await api.patch<ResponseTaskKanbanDTO>(
      `/task-kanban/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a kanban task
   * @param id - Task ID
   * @returns Success message
   */
  async deleteTask(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `/task-kanban/${id}`
    );
    return response.data;
  }

  /**
   * Update task status
   * @param id - Task ID
   * @param status - New status
   * @returns Updated task
   */
  async updateTaskStatus(
    id: string,
    status: TaskKanbanStatus
  ): Promise<ResponseTaskKanbanDTO> {
    return this.updateTask(id, { status });
  }

  /**
   * Update task priority
   * @param id - Task ID
   * @param priority - New priority
   * @returns Updated task
   */
  async updateTaskPriority(
    id: string,
    priority: TaskKanbanPriority
  ): Promise<ResponseTaskKanbanDTO> {
    return this.updateTask(id, { priority });
  }

  /**
   * Get tasks filtered by status
   * @param status - Task status to filter
   * @returns Filtered tasks
   */
  async getTasksByStatus(status: TaskKanbanStatus): Promise<ResponseTaskKanbanDTO[]> {
    const allTasks = await this.listTasks();
    return allTasks.filter((task) => task.status === status);
  }

  /**
   * Get tasks filtered by priority
   * @param priority - Task priority to filter
   * @returns Filtered tasks
   */
  async getTasksByPriority(
    priority: TaskKanbanPriority
  ): Promise<ResponseTaskKanbanDTO[]> {
    const allTasks = await this.listTasks();
    return allTasks.filter((task) => task.priority === priority);
  }
}

export default new TaskKanbanService();
