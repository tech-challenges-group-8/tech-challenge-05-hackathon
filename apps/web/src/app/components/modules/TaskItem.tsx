import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels } from '../../../utils';

interface TaskItemProps {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly onToggle: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[3]),
      padding: rem(space[3]),
      borderRadius: extractPixels(radii.lg),
    },
    active: {
      backgroundColor: themeColors.accent.DEFAULT,
    },
    completed: {
      opacity: 0.6,
    },
    checkbox: {
      width: rem(fontSizes.lg),
      height: rem(fontSizes.lg),
      borderRadius: extractPixels(radii.sm),
      borderWidth: 2,
      borderColor: themeColors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: themeColors.primary.DEFAULT,
      borderColor: themeColors.primary.DEFAULT,
    },
    text: {
      flex: 1,
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    textCompleted: {
      textDecorationLine: 'line-through',
      color: themeColors.muted.foreground,
    },
    deleteButton: {
      width: rem(space[8]),
      height: rem(space[8]),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

/**
 * TaskItem component represents a single task in the task list.
 * Handles toggling completion and deletion.
 */
export function TaskItem({ id, title, completed, onToggle, onDelete }: TaskItemProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <View style={[styles.container, completed && styles.completed]}>
      <TouchableOpacity
        style={[styles.checkbox, completed && styles.checkboxChecked]}
        onPress={() => onToggle(id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        accessibilityLabel={title}
      >
        {completed && (
          <Ionicons name="checkmark" size={16} color={theme.colors.card.DEFAULT} />
        )}
      </TouchableOpacity>

      <Text style={[styles.text, completed && styles.textCompleted]} numberOfLines={2}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(id)}
        accessibilityRole="button"
        accessibilityLabel="Delete task"
      >
        <Ionicons name="trash-outline" size={20} color={theme.colors.muted.foreground} />
      </TouchableOpacity>
    </View>
  );
}
