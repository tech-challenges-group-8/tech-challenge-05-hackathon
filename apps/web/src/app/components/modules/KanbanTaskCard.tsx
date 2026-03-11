import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels, fontWeight } from '../../../utils';
import { useTranslation } from 'react-i18next';
import type { KanbanTask } from '../../hooks/useKanbanBoard';
import type { TaskKanbanPriority } from '../../../services/task-kanban/types';

interface KanbanTaskCardProps {
  readonly task: KanbanTask;
  readonly onPress: () => void;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    taskCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[3]),
      marginBottom: rem(space[3]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: preferences.simpleInterface ? 0 : 0.05,
      shadowRadius: preferences.simpleInterface ? 0 : 2,
      elevation: preferences.simpleInterface ? 0 : 2,
    },
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    taskTitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.medium),
      color: themeColors.foreground,
      flex: 1,
      marginRight: rem(space[2]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    taskTitleCompleted: {
      textDecorationLine: 'line-through',
      color: themeColors.muted.foreground,
    },
    taskDescription: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      marginTop: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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
      fontWeight: fontWeight(fontWeights.medium),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function KanbanTaskCard({ task, onPress }: KanbanTaskCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  const getPriorityStyle = (priority?: TaskKanbanPriority) => {
    switch (priority) {
      case 'high':
        return {
          borderColor: theme.colors.accent.foreground,
          backgroundColor: theme.colors.accent.DEFAULT,
          textColor: theme.colors.accent.foreground,
        };
      case 'medium':
        return {
          borderColor: theme.colors.secondary.foreground,
          backgroundColor: theme.colors.secondary.DEFAULT,
          textColor: theme.colors.secondary.foreground,
        };
      case 'low':
      default:
        return {
          borderColor: theme.colors.primary.DEFAULT,
          backgroundColor: theme.colors.primary.DEFAULT,
          textColor: theme.colors.primary.foreground,
        };
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);

  return (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Task: ${task.title}${task.completed ? ', completed' : ''}`}
    >
      <View style={styles.taskHeader}>
        <Text
          style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}
          numberOfLines={2}
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
      {!preferences.hideUrgencyIndicators && (
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
      )}
    </TouchableOpacity>
  );
}
