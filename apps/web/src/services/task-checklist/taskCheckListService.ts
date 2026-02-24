import api from '../api';
import type {
  TaskCheckList,
  CreateTaskCheckListDTO,
  UpdateTaskCheckListDTO,
  ResponseTaskCheckListDto,
} from './types';

class TaskCheckListService {
  /**
   * Create a new checklist task
   * @param data - Task creation data
   * @returns Created task
   */
  async createTask(data: CreateTaskCheckListDTO): Promise<ResponseTaskCheckListDto> {
    const response = await api.post<ResponseTaskCheckListDto>(
      '/task-checklist',
      data
    );
    return response.data;
  }

  /**
   * List all checklist tasks for authenticated user
   * @returns Array of tasks
   */
  async listTasks(): Promise<ResponseTaskCheckListDto[]> {
    const response = await api.get<ResponseTaskCheckListDto[]>('/task-checklist');
    return response.data;
  }

  /**
   * Get a checklist task by ID
   * @param id - Task ID
   * @returns Task information
   */
  async getTask(id: string): Promise<ResponseTaskCheckListDto> {
    const response = await api.get<ResponseTaskCheckListDto>(
      `/task-checklist/${id}`
    );
    return response.data;
  }

  /**
   * Update a checklist task
   * @param id - Task ID
   * @param data - Task data to update
   * @returns Updated task
   */
  async updateTask(
    id: string,
    data: UpdateTaskCheckListDTO
  ): Promise<ResponseTaskCheckListDto> {
    const response = await api.patch<ResponseTaskCheckListDto>(
      `/task-checklist/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a checklist task
   * @param id - Task ID
   * @returns Success message
   */
  async deleteTask(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `/task-checklist/${id}`
    );
    return response.data;
  }

  /**
   * Mark a task as done
   * @param id - Task ID
   * @returns Updated task
   */
  async markTaskAsDone(id: string): Promise<ResponseTaskCheckListDto> {
    return this.updateTask(id, { isDone: true });
  }

  /**
   * Mark a task as not done
   * @param id - Task ID
   * @returns Updated task
   */
  async markTaskAsNotDone(id: string): Promise<ResponseTaskCheckListDto> {
    return this.updateTask(id, { isDone: false });
  }
}

export default new TaskCheckListService();
