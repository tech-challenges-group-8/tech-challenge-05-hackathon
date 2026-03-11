import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels } from '../../../utils';
import { useTranslation } from 'react-i18next';
import type { KanbanTask } from '../../hooks/useKanbanBoard';
import type { TaskKanbanStatus } from '../../../services/task-kanban/types';

interface KanbanActionModalProps {
  visible: boolean;
  activeTask: { task: KanbanTask; columnId: TaskKanbanStatus } | null;
  onClose: () => void;
  onMoveToTodo: () => void;
  onMoveToInProgress: () => void;
  onMoveToDone: () => void;
  onDelete: () => void;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: `${themeColors.black}80`,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: themeColors.card.DEFAULT,
      borderTopLeftRadius: extractPixels(radii.xl),
      borderTopRightRadius: extractPixels(radii.xl),
      padding: rem(space[6]),
    },
    modalTitle: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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
      fontSize: rem(fontSizes.md) * preferences.fontScale,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    modalDeleteText: {
      color: themeColors.accent.foreground,
    },
  });

export function KanbanActionModal({
  visible,
  activeTask,
  onClose,
  onMoveToTodo,
  onMoveToInProgress,
  onMoveToDone,
  onDelete,
}: KanbanActionModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  if (!activeTask) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={preferences.animationsEnabled ? 'fade' : 'none'}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('kanban.actions')}</Text>
          
          {activeTask.columnId !== 'todo' && (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={onMoveToTodo}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Move to To Do"
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.foreground} />
              <Text style={styles.modalOptionText}>
                {t('kanban.moveToTodo')}
              </Text>
            </TouchableOpacity>
          )}
          
          {activeTask.columnId !== 'in-progress' && (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={onMoveToInProgress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Move to In Progress"
            >
              <Ionicons name="construct" size={20} color={theme.colors.foreground} />
              <Text style={styles.modalOptionText}>
                {t('kanban.moveToInProgress')}
              </Text>
            </TouchableOpacity>
          )}
          
          {activeTask.columnId !== 'done' && (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={onMoveToDone}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Mark as Done"
            >
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.foreground} />
              <Text style={styles.modalOptionText}>
                {t('kanban.moveToDone')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.modalOption, { borderBottomWidth: 0 }]}
            onPress={onDelete}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete task"
          >
            <Ionicons name="trash" size={20} color={theme.colors.accent.foreground} />
            <Text style={[styles.modalOptionText, styles.modalDeleteText]}>
              {t('common.delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
