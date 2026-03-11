import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
  readonly columnWidth: number;
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
  columnWidth: number,
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    column: {
      width: columnWidth,
      backgroundColor: themeColors.muted.DEFAULT,
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
      fontSize: rem(fontSizes.md) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.semiBold),
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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
      flex: 1,
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
  const styles = useMemo(
    () => createStyles(theme.colors, columnWidth, preferences),
    [columnWidth, preferences, theme.colors],
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

      <ScrollView
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
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
      </ScrollView>
    </View>
  );
}
