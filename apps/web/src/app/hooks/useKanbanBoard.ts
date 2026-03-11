import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { taskKanbanService } from '../../services/task-kanban';
import type { ResponseTaskKanbanDTO, TaskKanbanStatus, TaskKanbanPriority } from '../../services/task-kanban/types';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: TaskKanbanStatus;
  priority?: TaskKanbanPriority;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface KanbanColumn {
  id: TaskKanbanStatus;
  title: string;
  tasks: KanbanTask[];
}

/**
 * Custom hook to manage kanban board state and operations.
 * Encapsulates all CRUD operations and state management for kanban tasks.
 */
export function useKanbanBoard() {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize columns structure
  const initializeColumns = useCallback((tasks: KanbanTask[]): KanbanColumn[] => {
    return [
      {
        id: 'todo',
        title: t('kanban.todoTitle', 'A Fazer'),
        tasks: tasks.filter((t) => t.status === 'todo'),
      },
      {
        id: 'in-progress',
        title: t('kanban.inProgressTitle', 'Em Progresso'),
        tasks: tasks.filter((t) => t.status === 'in-progress'),
      },
      {
        id: 'done',
        title: t('kanban.doneTitle', 'Concluído'),
        tasks: tasks.filter((t) => t.status === 'done'),
      },
    ];
  }, [t]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetch all kanban tasks from the service
   */
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await taskKanbanService.listTasks();
      const mappedTasks = fetchedTasks.map((t: ResponseTaskKanbanDTO) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status as TaskKanbanStatus,
        priority: t.priority as TaskKanbanPriority,
        completed: t.status === 'done',
        createdAt: new Date(t.createdAt),
        updatedAt: undefined,
      }));
      const initializedColumns = initializeColumns(mappedTasks);
      setColumns(initializedColumns);
    } catch (err) {
      console.error('Error fetching kanban tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch kanban tasks');
    } finally {
      setIsLoading(false);
    }
  }, [initializeColumns]);

  /**
   * Add a new kanban task
   */
  const addTask = useCallback(
    async (data: { title: string; description?: string; priority?: TaskKanbanPriority; status?: TaskKanbanStatus }) => {
      if (!data.title.trim()) return;

      try {
        setIsLoading(true);
        setError(null);
        const newTaskResponse = await taskKanbanService.createTask({
          title: data.title,
          description: data.description ?? '',
          priority: data.priority,
          status: data.status ?? 'todo',
        });

        const newTask: KanbanTask = {
          id: newTaskResponse.id,
          title: newTaskResponse.title,
          description: newTaskResponse.description,
          status: newTaskResponse.status as TaskKanbanStatus,
          priority: newTaskResponse.priority as TaskKanbanPriority,
          completed: newTaskResponse.status === 'done',
          createdAt: new Date(newTaskResponse.createdAt),
          updatedAt: undefined,
        };

        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.id === (newTask.status ?? 'todo') ? { ...col, tasks: [newTask, ...col.tasks] } : col
          )
        );
      } catch (err) {
        console.error('Error adding kanban task:', err);
        setError(err instanceof Error ? err.message : 'Failed to add kanban task');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Move task to a different column (change status)
   */
  const moveTask = useCallback(
    async (taskId: string, newStatus: TaskKanbanStatus) => {
      // Find task and old status
      let taskToMove: KanbanTask | null = null;
      let oldStatus: TaskKanbanStatus | null = null;

      for (const col of columns) {
        const found = col.tasks.find((t) => t.id === taskId);
        if (found) {
          taskToMove = found;
          oldStatus = col.id;
          break;
        }
      }

      if (!taskToMove || !oldStatus) return;

      // Optimistic update
      const updatedTask = { ...taskToMove, status: newStatus, completed: newStatus === 'done' };
      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === oldStatus) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
          if (col.id === newStatus) {
            return { ...col, tasks: [updatedTask, ...col.tasks] };
          }
          return col;
        })
      );

      try {
        await taskKanbanService.updateTask(taskId, { status: newStatus });
      } catch (err) {
        console.error('Error moving kanban task:', err);
        // Revert on error
        setColumns((prevColumns) =>
          prevColumns.map((col) => {
            if (col.id === newStatus) {
              return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
            }
            if (col.id === oldStatus) {
              return { ...col, tasks: [taskToMove!, ...col.tasks] };
            }
            return col;
          })
        );
        setError(err instanceof Error ? err.message : 'Failed to move kanban task');
      }
    },
    [columns]
  );

  /**
   * Update task details
   */
  const updateTask = useCallback(
    async (taskId: string, updates: Partial<KanbanTask>) => {
      // Find task
      let taskToUpdate: KanbanTask | null = null;

      for (const col of columns) {
        const found = col.tasks.find((t) => t.id === taskId);
        if (found) {
          taskToUpdate = found;
          break;
        }
      }

      if (!taskToUpdate) return;

      // Optimistic update
      const updatedTask = { ...taskToUpdate, ...updates };
      setColumns((prevColumns) =>
        prevColumns.map((col) => ({
          ...col,
          tasks: col.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        }))
      );

      try {
        await taskKanbanService.updateTask(taskId, {
          title: updates.title,
          description: updates.description,
          priority: updates.priority,
        });
      } catch (err) {
        console.error('Error updating kanban task:', err);
        // Revert on error
        setColumns((prevColumns) =>
          prevColumns.map((col) => ({
            ...col,
            tasks: col.tasks.map((t) => (t.id === taskId ? taskToUpdate : t)),
          }))
        );
        setError(err instanceof Error ? err.message : 'Failed to update kanban task');
      }
    },
    [columns]
  );

  /**
   * Delete a task
   */
  const deleteTask = useCallback(
    async (taskId: string) => {
      // Optimistic update
      const previousColumns = structuredClone(columns);
      setColumns((prevColumns) =>
        prevColumns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        }))
      );

      try {
        await taskKanbanService.deleteTask(taskId);
      } catch (err) {
        console.error('Error deleting kanban task:', err);
        // Revert on error
        setColumns(previousColumns);
        setError(err instanceof Error ? err.message : 'Failed to delete kanban task');
      }
    },
    [columns]
  );

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);
  const completedTasks = columns.reduce(
    (sum, col) => sum + col.tasks.filter((t) => t.completed).length,
    0
  );

  return {
    columns,
    isLoading,
    error,
    totalTasks,
    completedTasks,
    fetchTasks,
    addTask,
    moveTask,
    updateTask,
    deleteTask,
  };
}
