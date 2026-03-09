import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types defined locally for simplicity in this conversion
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

// Helper functions
const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);
const API_URL = 'http://localhost:3001/task-kanban';

const initialColumnsState: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'A Fazer',
    tasks: [],
  },
  {
    id: 'in-progress',
    title: 'Em Progresso',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Concluído',
    tasks: [],
  },
];

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors'], columnWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginBottom: rem(space[4]),
      paddingHorizontal: rem(space[1]),
    },
    title: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
    },
    subtitle: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.muted.foreground,
      marginTop: rem(space[1]),
    },
    columnsContainer: {
      paddingBottom: rem(space[4]),
    },
    column: {
      width: columnWidth, 
      backgroundColor: themeColors.muted.DEFAULT, // Using muted as background for column
      borderRadius: extractPixels(radii.xl),
      padding: rem(space[4]),
      marginRight: rem(space[4]),
      borderTopWidth: 4,
    },
    columnHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: rem(space[4]),
    },
    columnTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[2]),
    },
    columnTitle: {
      fontSize: rem(fontSizes.md),
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
    },
    badge: {
      backgroundColor: themeColors.background,
      paddingHorizontal: rem(space[2]),
      paddingVertical: 2,
      borderRadius: extractPixels(radii.full),
    },
    badgeText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.foreground,
    },
    addButton: {
      padding: rem(space[2]),
    },
    taskCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[3]),
      marginBottom: rem(space[3]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    taskTitle: {
      fontSize: rem(fontSizes.sm),
      fontWeight: fontWeights.medium as any,
      color: themeColors.foreground,
      flex: 1,
      marginRight: rem(space[2]),
    },
    taskTitleCompleted: {
      textDecorationLine: 'line-through',
      color: themeColors.muted.foreground,
    },
    taskDescription: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
      marginTop: rem(space[1]),
    },
    priorityBadge: {
      alignSelf: 'flex-start',
      marginTop: rem(space[2]),
      paddingHorizontal: rem(space[2]),
      paddingVertical: 2,
      borderRadius: extractPixels(radii.sm),
      borderWidth: 1,
    },
    priorityText: {
      fontSize: 10,
      fontWeight: fontWeights.medium as any,
    },
    inputCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[3]),
      marginBottom: rem(space[3]),
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[2]),
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    inputActions: {
      flexDirection: 'row',
      gap: rem(space[2]),
    },
    actionButton: {
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[2]),
      borderRadius: extractPixels(radii.md),
      backgroundColor: themeColors.primary.DEFAULT,
    },
    actionButtonText: {
      color: themeColors.primary.foreground,
      fontSize: rem(fontSizes.xs),
      fontWeight: fontWeights.medium as any,
    },
    cancelButton: {
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[2]),
    },
    cancelButtonText: {
      color: themeColors.muted.foreground,
      fontSize: rem(fontSizes.xs),
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: themeColors.card.DEFAULT,
      borderTopLeftRadius: extractPixels(radii.xl),
      borderTopRightRadius: extractPixels(radii.xl),
      padding: rem(space[6]),
    },
    modalTitle: {
      fontSize: rem(fontSizes.lg),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
    },
    modalOption: {
      paddingVertical: rem(space[4]),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[3]),
    },
    modalOptionText: {
      fontSize: rem(fontSizes.md),
      color: themeColors.foreground,
    },
    modalDeleteText: {
      color: '#FF5252',
    },
  });

export function KanbanBoard() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;
  const columnWidth = isDesktop ? (width - 400) / 3 : width * 0.85;
  const styles = useMemo(() => createStyles(theme.colors, columnWidth), [theme.colors, columnWidth]);

  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumnsState);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<TaskStatus | null>(null);
  const [activeTask, setActiveTask] = useState<{ task: Task; columnId: TaskStatus } | null>(null);

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchTasks = async () => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get(API_URL, config);
      const tasks: Task[] = response.data.map((t: any) => ({
        ...t,
        completed: t.status === 'done',
      })) as Task[];

      const newColumns: KanbanColumn[] = initialColumnsState.map(col => ({ ...col, tasks: [] }));

      tasks.forEach(task => {
        const column = newColumns.find(c => c.id === task.status);
        if (column) {
          column.tasks.push(task);
        }
      });

      setColumns(newColumns);
    } catch (error) {
      console.error('Error fetching kanban tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (columnId: TaskStatus) => {
    if (!newTaskTitle.trim()) return;

    try {
      const config = await getAuthHeaders();
      const response = await axios.post(
        API_URL,
        {
          title: newTaskTitle,
          status: columnId,
          priority: 'medium', // Default priority
        },
        config,
      );

      const newTask: Task = {
        ...response.data,
        completed: response.data.status === 'done',
      };

      setColumns(cols =>
        cols.map(col => (col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col)),
      );
      setNewTaskTitle('');
      setAddingToColumn(null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (columnId: TaskStatus, taskId: string) => {
    const previousColumns = JSON.parse(JSON.stringify(columns));
    // Optimistic update
    setColumns(cols =>
      cols.map(col =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col,
      ),
    );
    setActiveTask(null);

    try {
      const config = await getAuthHeaders();
      await axios.delete(`${API_URL}/${taskId}`, config);
    } catch (error) {
      console.error('Error deleting task:', error);
      setColumns(previousColumns); // Revert on error
    }
  };

  const moveTask = async (taskId: string, fromColumn: TaskStatus, toColumn: TaskStatus) => {
    if (fromColumn === toColumn) return;

    const previousColumns = JSON.parse(JSON.stringify(columns));

    // Optimistic update
    setColumns(cols => {
      const task = cols.find(c => c.id === fromColumn)?.tasks.find(t => t.id === taskId);
      if (!task) return cols;

      return cols.map(col => {
        if (col.id === fromColumn) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        if (col.id === toColumn) {
          return {
            ...col,
            tasks: [...col.tasks, { ...task, status: toColumn, completed: toColumn === 'done' }],
          };
        }
        return col;
      });
    });
    setActiveTask(null);

    try {
      const config = await getAuthHeaders();
      await axios.patch(
        `${API_URL}/${taskId}`,
        {
          status: toColumn,
        },
        config,
      );
    } catch (error) {
      console.error('Error moving task:', error);
      setColumns(previousColumns); // Revert on error
    }
  };

  const getPriorityStyle = (priority?: TaskPriority) => {
    switch (priority) {
      case 'high':
        return {
          borderColor: '#FF5252',
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          textColor: '#FF5252',
        };
      case 'medium':
        return {
          borderColor: '#FFC107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          textColor: '#FFC107',
        };
      case 'low':
      default:
        return {
          borderColor: '#4D9973',
          backgroundColor: 'rgba(77, 153, 115, 0.1)',
          textColor: '#4D9973',
        };
    }
  };

  const getColumnBorderColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return theme.colors.muted.foreground;
      case 'in-progress':
        return theme.colors.primary.DEFAULT;
      case 'done':
        return '#4D9973'; // success
      default:
        return theme.colors.border;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('kanban.title', 'Quadro Kanban')}</Text>
        <Text style={styles.subtitle}>
          {t('kanban.subtitle', 'Organize suas tarefas de forma visual')}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columnsContainer}
        decelerationRate="fast"
        snapToInterval={columnWidth + 16} // Width + margin
      >
        {columns.map((column) => (
          <View
            key={column.id}
            style={[styles.column, { borderTopColor: getColumnBorderColor(column.id) }]}
          >
            <View style={styles.columnHeader}>
              <View style={styles.columnTitleContainer}>
                <Text style={styles.columnTitle}>{column.title}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{column.tasks.length}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddingToColumn(column.id)}
              >
                <Ionicons name="add" size={20} color={theme.colors.muted.foreground} />
              </TouchableOpacity>
            </View>

            {addingToColumn === column.id && (
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  placeholder={t('kanban.newTaskPlaceholder', 'Título da tarefa...')}
                  placeholderTextColor={theme.colors.muted.foreground}
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  onSubmitEditing={() => addTask(column.id)}
                  autoFocus
                />
                <View style={styles.inputActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => addTask(column.id)}
                  >
                    <Text style={styles.actionButtonText}>{t('common.add', 'Adicionar')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setAddingToColumn(null);
                      setNewTaskTitle('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>{t('common.cancel', 'Cancelar')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <ScrollView style={{ flex: 1 }}>
              {column.tasks.map((task) => {
                const priorityStyle = getPriorityStyle(task.priority);

                return (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskCard}
                    onPress={() => setActiveTask({ task, columnId: column.id })}
                  >
                    <View style={styles.taskHeader}>
                      <Text
                        style={[
                          styles.taskTitle,
                          task.completed && styles.taskTitleCompleted,
                        ]}
                      >
                        {task.title}
                      </Text>
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={16}
                        color={theme.colors.muted.foreground}
                      />
                    </View>
                    {task.description && (
                      <Text style={styles.taskDescription} numberOfLines={2}>
                        {task.description}
                      </Text>
                    )}
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          borderColor: priorityStyle.borderColor,
                          backgroundColor: priorityStyle.backgroundColor,
                        },
                      ]}
                    >
                      <Text style={[styles.priorityText, { color: priorityStyle.textColor }]}>
                        {t(`priority.${task.priority}`, task.priority ?? 'low')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Action Modal */}
      <Modal
        visible={!!activeTask}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveTask(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveTask(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('kanban.actions', 'Ações')}</Text>
            
            {activeTask?.columnId !== 'todo' && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => moveTask(activeTask!.task.id, activeTask!.columnId, 'todo')}
              >
                <Ionicons name="arrow-back" size={20} color={theme.colors.foreground} />
                <Text style={styles.modalOptionText}>{t('kanban.moveToTodo', 'Mover para A Fazer')}</Text>
              </TouchableOpacity>
            )}
            
            {activeTask?.columnId !== 'in-progress' && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => moveTask(activeTask!.task.id, activeTask!.columnId, 'in-progress')}
              >
                <Ionicons name="construct" size={20} color={theme.colors.foreground} />
                <Text style={styles.modalOptionText}>{t('kanban.moveToInProgress', 'Mover para Em Progresso')}</Text>
              </TouchableOpacity>
            )}
            
            {activeTask?.columnId !== 'done' && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => moveTask(activeTask!.task.id, activeTask!.columnId, 'done')}
              >
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.foreground} />
                <Text style={styles.modalOptionText}>{t('kanban.moveToDone', 'Marcar como Concluído')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.modalOption, { borderBottomWidth: 0 }]}
              onPress={() => deleteTask(activeTask!.columnId, activeTask!.task.id)}
            >
              <Ionicons name="trash" size={20} color={'#FF5252'} />
              <Text style={[styles.modalOptionText, styles.modalDeleteText]}>
                {t('common.delete', 'Excluir')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
