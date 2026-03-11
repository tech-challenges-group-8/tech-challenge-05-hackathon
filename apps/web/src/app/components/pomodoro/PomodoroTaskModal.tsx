import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useFocusTimer } from '../../context/FocusTimerContext';
import { AppButton, ModalSheet } from '../ui';
import { rem, extractPixels } from '../../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    modalTitle: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      textAlign: 'center',
    },
    inputLabel: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    taskModalButton: {
      padding: rem(space[4]),
      backgroundColor: themeColors.card.DEFAULT,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      marginBottom: rem(space[2]),
    },
    taskModalButtonText: {
      fontSize: rem(fontSizes.md),
      color: themeColors.foreground,
    },
    tasksList: {
      maxHeight: 200,
      marginBottom: rem(space[4]),
    },
    description: {
      textAlign: 'center',
      marginBottom: rem(space[4]),
    },
    emptyText: {
      textAlign: 'center',
      color: themeColors.muted.foreground,
    },
  });

export function PomodoroTaskModal() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  
  const {
    tasks,
    isFocusCompleteModalOpen,
    submitTaskCompletionTime
  } = useFocusTimer();

  return (
    <ModalSheet
      isVisible={isFocusCompleteModalOpen}
      onClose={() => submitTaskCompletionTime(null)}
      title={t('pages.focus.focusCompleteModalTitle', 'Focus Session Completed!')}
      type="centered"
    >
      <View>
        <Text style={[styles.inputLabel, styles.description]}>
          {t('pages.focus.focusCompleteModalDesc', 'Great job! If you were working on a specific task, you can assign this time to it below.')}
        </Text>

        <ScrollView style={styles.tasksList}>
          {settings?.tasks?.filter(t => !t.completed).map(task => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskModalButton}
              onPress={() => submitTaskCompletionTime(task.id)}
            >
              <Text style={styles.taskModalButtonText}>{task.title}</Text>
            </TouchableOpacity>
          ))}
          {(!settings?.tasks || settings.tasks.filter(t => !t.completed).length === 0) && (
            <Text style={styles.emptyText}>
              {t('pages.focus.noTasksAvailable', 'No active tasks to assign time to.')}
            </Text>
          )}
        </ScrollView>

        <AppButton onPress={() => submitTaskCompletionTime(null)}>
          {t('common.skip', 'Skip')}
        </AppButton>
      </View>
    </ModalSheet>
  );
}
