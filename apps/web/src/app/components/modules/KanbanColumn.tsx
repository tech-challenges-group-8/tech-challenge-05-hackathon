import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels, fontWeight } from '../../../utils';
import { KanbanTaskCard } from './KanbanTaskCard';
import type { KanbanTask } from '../../hooks/useKanbanBoard';
import type { TaskKanbanStatus } from '../../../services/task-kanban/types';

interface KanbanColumnProps {
  readonly id: TaskKanbanStatus;
  readonly title: string;
  readonly tasks: KanbanTask[];
  readonly columnWidth: number | '100%';
  readonly onTaskPress: (task: KanbanTask, columnId: TaskKanbanStatus) => void;
  readonly onAddPress: (columnId: TaskKanbanStatus) => void;
  readonly isAdding: boolean;
  readonly newTaskTitle: string;
  readonly onNewTaskTitleChange: (text: string) => void;
  readonly onAddTask: () => void;
  readonly onCancelAdd: () => void;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  columnWidth: number | '100%',
  preferences: ReturnType<typeof useCognitivePreferences>,
  isCompact: boolean,
) =>
  StyleSheet.create({
    column: {
      width: columnWidth,
      minWidth: 0,
      backgroundColor: themeColors.muted.DEFAULT,
      borderRadius: extractPixels(radii.xl),
      padding: rem(space[4]),
      marginRight: isCompact ? 0 : rem(space[4]),
      marginBottom: isCompact ? rem(space[2]) : 0,
      borderTopWidth: isCompact ? 0 : 4,
    },
    columnHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: rem(space[4]),
      gap: rem(space[2]),
    },
    columnTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[2]),
      flex: 1,
      minWidth: 0,
    },
    columnTitle: {
      fontSize: rem(fontSizes.md) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.semiBold),
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
    },
    badge: {
      backgroundColor: themeColors.background,
      paddingHorizontal: rem(space[2]),
      paddingVertical: 2,
      borderRadius: extractPixels(radii.full),
    },
    badgeText: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    addButton: {
      padding: rem(space[2]),
    },
    taskList: {
      minWidth: 0,
    },
    inputCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[3]),
      marginBottom: rem(space[3]),
    },
    input: {
      width: '100%',
      minWidth: 0,
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
      flexDirection: isCompact ? 'column' : 'row',
      gap: rem(space[2]),
    },
    actionButton: {
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[2]),
      borderRadius: extractPixels(radii.md),
      backgroundColor: themeColors.primary.DEFAULT,
      alignItems: 'center',
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
      alignItems: isCompact ? 'center' : 'flex-start',
    },
    cancelButtonText: {
      color: themeColors.muted.foreground,
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    emptyColumnText: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function KanbanColumn({
  id,
  title,
  tasks,
  columnWidth,
  onTaskPress,
  onAddPress,
  isAdding,
  newTaskTitle,
  onNewTaskTitleChange,
  onAddTask,
  onCancelAdd,
}: KanbanColumnProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const isCompact = columnWidth === '100%' || columnWidth < 340;
  const styles = useMemo(
    () => createStyles(theme.colors, columnWidth, preferences, isCompact),
    [columnWidth, isCompact, preferences, theme.colors],
  );

  const getColumnBorderColor = (status: TaskKanbanStatus) => {
    switch (status) {
      case 'todo':
        return theme.colors.muted.foreground;
      case 'in-progress':
        return theme.colors.primary.DEFAULT;
      case 'done':
        return theme.colors.primary.DEFAULT;
      default:
        return theme.colors.border;
    }
  };

  return (
    <View style={[styles.column, { borderTopColor: getColumnBorderColor(id) }]}>
      <View style={styles.columnHeader}>
        <View style={styles.columnTitleContainer}>
          <Text style={styles.columnTitle}>{title}</Text>
          <View style={styles.badge}>
            <Text
              style={styles.badgeText}
              accessibilityLabel={t('accessibility.modules.tasksCount', { count: tasks.length })}
            >
              {tasks.length}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddPress(id)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.modules.addTaskToColumn', { column: title })}
        >
          <Ionicons
            name="add"
            size={20}
            color={theme.colors.muted.foreground}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </TouchableOpacity>
      </View>

      {isAdding && (
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder={t('kanban.newTaskPlaceholder')}
            placeholderTextColor={theme.colors.muted.foreground}
            value={newTaskTitle}
            onChangeText={onNewTaskTitleChange}
            onSubmitEditing={onAddTask}
            autoFocus
            accessibilityLabel={t('accessibility.modules.newTaskInput')}
          />
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onAddTask}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.modules.confirmAddTask')}
            >
              <Text style={styles.actionButtonText}>{t('common.add')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancelAdd}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.modules.cancelAddTask')}
            >
              <Text style={styles.cancelButtonText}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={styles.taskList}
        accessibilityRole="summary"
        accessibilityLabel={t('accessibility.modules.columnTaskList', { column: title })}
      >
        {tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            onPress={() => onTaskPress(task, id)}
          />
        ))}
        {tasks.length === 0 && !isAdding ? (
          <Text style={styles.emptyColumnText}>{t('tasks.list.noTasks')}</Text>
        ) : null}
      </View>
    </View>
  );
}
