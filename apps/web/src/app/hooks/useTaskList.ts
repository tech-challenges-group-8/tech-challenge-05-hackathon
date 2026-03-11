import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { taskCheckListService } from '../../services/task-checklist';
import type { ResponseTaskCheckListDto } from '../../services/task-checklist/types';
import { logger } from '../../utils';

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const COMPLETION_MESSAGES = [
  'tasks.list.completionMessage1',
  'tasks.list.completionMessage2',
  'tasks.list.completionMessage3',
  'tasks.list.completionMessage4',
  'tasks.list.completionMessage5',
];

/**
 * Custom hook to manage task checklist state and operations.
 * Encapsulates all CRUD operations and state management for tasks.
 */
export function useTaskList() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetch all tasks from the service
   */
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await taskCheckListService.listTasks();
      const mappedTasks = fetchedTasks.map((t: ResponseTaskCheckListDto) => ({
        id: t.id,
        title: t.description, // Backend uses 'description'
        completed: t.isDone,
        createdAt: new Date(t.createdAt),
      }));
      setTasks(mappedTasks);
    } catch (err) {
      logger.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new task
   */
  const addTask = useCallback(
    async (title: string) => {
      if (!title.trim()) return;

      try {
        setIsLoading(true);
        setError(null);
        const newTaskResponse = await taskCheckListService.createTask({
          description: title,
        });

        const newTask: TaskItem = {
          id: newTaskResponse.id,
          title: newTaskResponse.description,
          completed: newTaskResponse.isDone,
          createdAt: new Date(newTaskResponse.createdAt),
        };

        setTasks([newTask, ...tasks]);
      } catch (err) {
        logger.error('Error adding task:', err);
        setError(err instanceof Error ? err.message : 'Failed to add task');
      } finally {
        setIsLoading(false);
      }
    },
    [tasks]
  );

  /**
   * Toggle task completion status
   */
  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const wasCompleted = task.completed;
      const newStatus = !task.completed;

      // Optimistic update
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: newStatus } : t)));

      // Show completion message if completing
      if (!wasCompleted) {
        const messageKey = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
        setCompletionMessage(t(messageKey));
        setTimeout(() => setCompletionMessage(null), 3000);
      }

      try {
        await taskCheckListService.updateTask(id, {
          isDone: newStatus,
        });
      } catch (err) {
        logger.error('Error toggling task:', err);
        // Revert on error
        setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !newStatus } : t)));
        setError(err instanceof Error ? err.message : 'Failed to update task');
      }
    },
    [tasks, t]
  );

  /**
   * Delete a task
   */
  const deleteTask = useCallback(
    async (id: string) => {
      // Optimistic update
      const previousTasks = [...tasks];
      setTasks(tasks.filter((t) => t.id !== id));

      try {
        await taskCheckListService.deleteTask(id);
      } catch (err) {
        logger.error('Error deleting task:', err);
        // Revert on error
        setTasks(previousTasks);
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    },
    [tasks]
  );

  /**
   * Clear all completed tasks
   */
  const clearCompleted = useCallback(async () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(tasks.filter((t) => !t.completed));

    try {
      await Promise.all(completedTasks.map((t) => taskCheckListService.deleteTask(t.id)));
    } catch (err) {
      logger.error('Error clearing completed tasks:', err);
      // Revert on error
      setTasks(previousTasks);
      setError(err instanceof Error ? err.message : 'Failed to clear completed tasks');
    }
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return {
    tasks,
    isLoading,
    error,
    completionMessage,
    completedCount,
    totalCount,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}
