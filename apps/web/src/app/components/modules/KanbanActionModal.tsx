import React, { useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  Platform,
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
import type { TaskKanbanStatus } from '../../../services/task-kanban/types';

interface KanbanActionModalProps {
  readonly visible: boolean;
  readonly activeTask: { task: KanbanTask; columnId: TaskKanbanStatus } | null;
  readonly onClose: () => void;
  readonly onMoveToTodo: () => void;
  readonly onMoveToInProgress: () => void;
  readonly onMoveToDone: () => void;
  readonly onDelete: () => void;
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
      fontWeight: fontWeight(fontWeights.bold),
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
      color: themeColors.destructive.foreground,
    },
    modalOptionLast: {
      borderBottomWidth: 0,
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
  const modalRef = useRef<any>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  const webDialogProps: Record<string, unknown> =
    Platform.OS === 'web' ? { role: 'dialog', 'aria-modal': true } : {};

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) {
      return;
    }

    previousActiveRef.current = document.activeElement as HTMLElement;
    setTimeout(() => {
      const container = modalRef.current as HTMLElement | null;
      const elements = container?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      elements?.[0]?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const container = modalRef.current as HTMLElement | null;
      const elements = container?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!elements || elements.length === 0) {
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousActiveRef.current?.focus();
    };
  }, [onClose, visible]);

  if (!activeTask) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={preferences.animationsEnabled ? 'fade' : 'none'}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.components.closeModal')}
        />
        <View
          ref={modalRef}
          style={styles.modalContent}
          accessibilityViewIsModal
          accessibilityRole="summary"
          accessibilityLabel={t('kanban.actions')}
          {...webDialogProps}
        >
          <Text style={styles.modalTitle}>{t('kanban.actions')}</Text>
          
          {activeTask.columnId !== 'todo' && (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={onMoveToTodo}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t('kanban.moveToTodo')}
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
              accessibilityLabel={t('kanban.moveToInProgress')}
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
              accessibilityLabel={t('kanban.moveToDone')}
            >
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.foreground} />
              <Text style={styles.modalOptionText}>
                {t('kanban.moveToDone')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.modalOption, styles.modalOptionLast]}
            onPress={onDelete}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('common.delete')}
          >
            <Ionicons name="trash" size={20} color={theme.colors.accent.foreground} />
            <Text style={[styles.modalOptionText, styles.modalDeleteText]}>
              {t('common.delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
