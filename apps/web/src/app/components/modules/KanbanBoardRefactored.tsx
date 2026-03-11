import React, { useMemo, useState } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels, fontWeight } from '../../../utils';
import { useKanbanBoard } from '../../hooks';
import type { KanbanTask } from '../../hooks/useKanbanBoard';
import type { TaskKanbanStatus } from '../../../services/task-kanban/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanActionModal } from './KanbanActionModal';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginBottom: rem(space[4]),
      paddingHorizontal: rem(space[1]),
    },
    title: {
      fontSize: rem(fontSizes.xl) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    subtitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      marginTop: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    columnsContainer: {
      paddingBottom: rem(space[4]),
    },
    inputCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[3]),
      marginBottom: rem(space[3]),
      marginRight: rem(space[4]),
      width: 260,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[2]),
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.medium),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    cancelButton: {
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[2]),
    },
    cancelButtonText: {
      color: themeColors.muted.foreground,
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    statusText: {
      marginTop: rem(space[2]),
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
    },
  });

export function KanbanBoardRefactored() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;
  const columnWidth = isDesktop ? (width - 400) / 3 : width * 0.85;

  const { columns, isLoading, error, totalTasks, completedTasks, addTask, moveTask, deleteTask } =
    useKanbanBoard();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<TaskKanbanStatus | null>(null);
  const [activeTask, setActiveTask] = useState<{ task: KanbanTask; columnId: TaskKanbanStatus } | null>(
    null,
  );

  const handleAddTask = async (columnId: TaskKanbanStatus) => {
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle, priority: 'medium', status: columnId });
    setNewTaskTitle('');
    setAddingToColumn(null);
  };

  const boardWebProps: Record<string, unknown> = Platform.OS === 'web' ? { role: 'list' } : {};
  const alertWebProps: Record<string, unknown> =
    Platform.OS === 'web' ? { role: 'alert', 'aria-live': 'assertive' } : {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('kanban.title')}</Text>
        <Text style={styles.subtitle}>{t('kanban.subtitle')}</Text>
        <Text style={styles.statusText}>
          {completedTasks}/{totalTasks} {t('tasks.list.progress')}
        </Text>
        {error && (
          <Text
            style={styles.statusText}
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            {...alertWebProps}
          >
            {error}
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columnsContainer}
        decelerationRate="fast"
        snapToInterval={columnWidth + 16}
        accessibilityRole="summary"
        accessibilityLabel={t('accessibility.modules.kanbanBoardColumns')}
        {...boardWebProps}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            columnWidth={columnWidth}
            isAdding={addingToColumn === column.id}
            newTaskTitle={newTaskTitle}
            onNewTaskTitleChange={setNewTaskTitle}
            onAddTask={() => handleAddTask(column.id)}
            onCancelAdd={() => {
              setAddingToColumn(null);
              setNewTaskTitle('');
            }}
            onTaskPress={(task, columnId) => setActiveTask({ task, columnId })}
            onAddPress={(columnId) => setAddingToColumn(columnId)}
          />
        ))}
      </ScrollView>

      <KanbanActionModal
        visible={!!activeTask}
        activeTask={activeTask}
        onClose={() => setActiveTask(null)}
        onMoveToTodo={async () => {
          if (!activeTask) return;
          await moveTask(activeTask.task.id, 'todo');
          setActiveTask(null);
        }}
        onMoveToInProgress={async () => {
          if (!activeTask) return;
          await moveTask(activeTask.task.id, 'in-progress');
          setActiveTask(null);
        }}
        onMoveToDone={async () => {
          if (!activeTask) return;
          await moveTask(activeTask.task.id, 'done');
          setActiveTask(null);
        }}
        onDelete={async () => {
          if (!activeTask) return;
          await deleteTask(activeTask.task.id);
          setActiveTask(null);
        }}
      />
    </View>
  );
}
