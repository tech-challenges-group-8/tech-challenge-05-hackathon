import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels } from '../../../utils';
import { KanbanTaskCard } from './KanbanTaskCard';
import type { KanbanTask } from '../../hooks/useKanbanBoard';
import type { TaskKanbanStatus } from '../../../services/task-kanban/types';

interface KanbanColumnProps {
  id: TaskKanbanStatus;
  title: string;
  tasks: KanbanTask[];
  columnWidth: number;
  onTaskPress: (task: KanbanTask, columnId: TaskKanbanStatus) => void;
  onAddPress: (columnId: TaskKanbanStatus) => void;
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
      fontWeight: fontWeights.semiBold as any,
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
  });

export function KanbanColumn({
  id,
  title,
  tasks,
  columnWidth,
  onTaskPress,
  onAddPress,
}: KanbanColumnProps) {
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
            <Text style={styles.badgeText}>{tasks.length}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddPress(id)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Add task to ${title}`}
        >
          <Ionicons name="add" size={20} color={theme.colors.muted.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
