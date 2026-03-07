import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Helper functions from other files
const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

// API Configuration
const API_URL = 'http://localhost:3001/task-checklist';

// Interface for a task
interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Messages for when a task is completed
const completionMessages = [
  'Excelente! Você concluiu uma tarefa 🎉',
  'Muito bem! Continue assim 💪',
  'Ótimo trabalho! 🌟',
  'Incrível! Você está progredindo ✨',
  'Perfeito! Cada passo conta 🚀',
];

// Styles
const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: rem(space[4]),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: rem(space[6]),
    },
    headerTitle: {
      fontSize: rem(fontSizes['2xl']),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
    },
    headerSubtitle: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.muted.foreground,
      marginTop: rem(space[1]),
    },
    addButton: {
      backgroundColor: themeColors.primary.DEFAULT,
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      borderRadius: extractPixels(radii.md),
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[2]),
    },
    addButtonText: {
      color: themeColors.primary.foreground,
      fontWeight: fontWeights.semiBold as any,
      fontSize: rem(fontSizes.sm),
    },
    completionMessage: {
      backgroundColor: 'rgba(77, 153, 115, 0.1)', // success/10
      color: '#4D9973', // success
      padding: rem(space[3]),
      borderRadius: extractPixels(radii.lg),
      textAlign: 'center',
      marginBottom: rem(space[4]),
    },
    progressCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[4]),
      marginBottom: rem(space[4]),
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: rem(space[2]),
    },
    progressLabel: {
      fontSize: rem(fontSizes.sm),
      fontWeight: fontWeights.medium as any,
      color: themeColors.foreground,
    },
    progressCount: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.muted.foreground,
    },
    progressBarContainer: {
      height: rem(space[2]),
      backgroundColor: themeColors.muted.DEFAULT,
      borderRadius: extractPixels(radii.full),
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: themeColors.primary.DEFAULT,
      borderRadius: extractPixels(radii.full),
    },
    addCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[4]),
      marginBottom: rem(space[4]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      backgroundColor: themeColors.background,
    },
    addButtonsContainer: {
      flexDirection: 'row',
      gap: rem(space[2]),
      marginTop: rem(space[3]),
    },
    listCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
    },
    listHeader: {
      padding: rem(space[4]),
      paddingBottom: rem(space[3]),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listTitle: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeights.medium as any,
      color: themeColors.foreground,
    },
    clearButtonText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
    },
    listContent: {
      padding: rem(space[2]),
    },
    emptyListContainer: {
      alignItems: 'center',
      paddingVertical: rem(space[8]),
    },
    emptyListText: {
      color: themeColors.muted.foreground,
      marginTop: rem(space[3]),
    },
    emptyListSubtext: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.muted.foreground,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[3]),
      padding: rem(space[3]),
      borderRadius: extractPixels(radii.lg),
    },
    taskItemActive: {
      backgroundColor: themeColors.accent.DEFAULT,
    },
    taskItemCompleted: {
      opacity: 0.6,
    },
    checkboxBase: {
      width: rem(fontSizes.lg),
      height: rem(fontSizes.lg),
      borderRadius: extractPixels(radii.sm),
      borderWidth: 2,
      borderColor: themeColors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#4D9973', // success
      borderColor: '#4D9973',
    },
    taskText: {
      flex: 1,
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
    },
    taskTextCompleted: {
      textDecorationLine: 'line-through',
      color: themeColors.muted.foreground,
    },
    deleteButton: {
      width: rem(space[8]),
      height: rem(space[8]),
      alignItems: 'center',
      justifyContent: 'center',
    },
    encouragementText: {
      textAlign: 'center',
      fontSize: rem(fontSizes.sm),
      color: themeColors.muted.foreground,
      marginTop: rem(space[4]),
    },
    successText: {
      color: '#4D9973',
      fontWeight: fontWeights.medium as any,
    },
  });

// Custom Checkbox Component
const CustomCheckbox = ({
  checked,
  onCheckedChange,
  style,
  checkedStyle,
}: {
  checked: boolean;
  onCheckedChange: () => void;
  style: any;
  checkedStyle: any;
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onCheckedChange} style={[style, checked && checkedStyle]}>
      {checked && <Ionicons name="checkmark" size={16} color={theme.colors.card.DEFAULT} />}
    </TouchableOpacity>
  );
};

export function TaskList() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

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
      const mappedTasks = response.data.map((t: any) => ({
        id: t.id,
        title: t.description, // Mapping description from backend to title
        completed: t.completed,
        createdAt: new Date(t.createdAt),
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const config = await getAuthHeaders();
      const response = await axios.post(
        API_URL,
        {
          description: newTaskTitle,
        },
        config
      );

      const newTask: TaskItem = {
        id: response.data.id,
        title: response.data.description,
        completed: response.data.completed,
        createdAt: new Date(response.data.createdAt),
      };

      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const wasCompleted = task?.completed;
    const newStatus = !task.completed;

    // Optimistic update
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: newStatus } : t)));

    if (!wasCompleted) {
      const randomMessage =
        completionMessages[Math.floor(Math.random() * completionMessages.length)];
      setCompletionMessage(randomMessage);
      setTimeout(() => setCompletionMessage(null), 3000);
    }

    try {
      const config = await getAuthHeaders();
      await axios.patch(
        `${API_URL}/${id}`,
        {
          isDone: newStatus,
        },
        config
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert on error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !newStatus } : t)));
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(tasks.filter((t) => t.id !== id));

    try {
      const config = await getAuthHeaders();
      await axios.delete(`${API_URL}/${id}`, config);
    } catch (error) {
      console.error('Error deleting task:', error);
      setTasks(previousTasks);
    }
  };

  const clearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(tasks.filter((t) => !t.completed));

    try {
      const config = await getAuthHeaders();
      // Delete sequentially or in parallel
      await Promise.all(
        completedTasks.map((t) => axios.delete(`${API_URL}/${t.id}`, config))
      );
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
      setTasks(previousTasks);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('tasks.list.title', 'Lista de Tarefas')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('tasks.list.subtitle', 'Acompanhe suas tarefas do dia')}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <Ionicons name="add" size={16} color={theme.colors.primary.foreground} />
          <Text style={styles.addButtonText}>{t('tasks.list.newTask', 'Nova Tarefa')}</Text>
        </TouchableOpacity>
      </View>

      {completionMessage && <Text style={styles.completionMessage}>{completionMessage}</Text>}

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{t('tasks.list.progress', 'Progresso')}</Text>
          <Text style={styles.progressCount}>
            {completedCount} de {totalCount}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` },
            ]}
          />
        </View>
      </View>

      {isAdding && (
        <View style={styles.addCard}>
          <TextInput
            style={styles.input}
            placeholder={t('tasks.list.placeholder', 'O que você precisa fazer?')}
            placeholderTextColor={theme.colors.muted.foreground}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={addTask}
            autoFocus
          />
          <View style={styles.addButtonsContainer}>
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>{t('common.add', 'Adicionar')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsAdding(false);
                setNewTaskTitle('');
              }}
            >
              <Text style={{ color: theme.colors.muted.foreground, padding: rem(space[3]) }}>
                {t('common.cancel', 'Cancelar')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{t('tasks.list.tasks', 'Tarefas')}</Text>
          {completedCount > 0 && (
            <TouchableOpacity onPress={clearCompleted}>
              <Text style={styles.clearButtonText}>
                {t('tasks.list.clearCompleted', 'Limpar concluídas')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.listContent}>
          {tasks.length === 0 ? (
            <View style={styles.emptyListContainer}>
              <Ionicons
                name="ellipse-outline"
                size={48}
                color={theme.colors.muted.foreground}
                style={{ opacity: 0.3 }}
              />
              <Text style={styles.emptyListText}>
                {t('tasks.list.noTasks', 'Nenhuma tarefa ainda')}
              </Text>
              <Text style={styles.emptyListSubtext}>
                {t('tasks.list.addFirst', 'Adicione sua primeira tarefa acima')}
              </Text>
            </View>
          ) : (
            tasks.map((task) => {
              const isActive = activeTaskId === task.id;
              return (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => setActiveTaskId(isActive ? null : task.id)}
                  style={[
                    styles.taskItem,
                    isActive && styles.taskItemActive,
                    task.completed && styles.taskItemCompleted,
                  ]}
                >
                  <CustomCheckbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    style={styles.checkboxBase}
                    checkedStyle={styles.checkboxChecked}
                  />
                  <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                    {task.title}
                  </Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(task.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={theme.colors.muted.foreground}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      {completedCount > 0 && (
        <Text style={styles.encouragementText}>
          {completedCount === totalCount && totalCount > 0 ? (
            <Text style={styles.successText}>
              {t('tasks.list.allDone', '🎉 Parabéns! Você completou todas as tarefas!')}
            </Text>
          ) : (
            <Text>
              {t('tasks.list.keepGoing', 'Continue assim! Cada tarefa concluída é uma vitória. 💚')}
            </Text>
          )}
        </Text>
      )}
    </ScrollView>
  );
}