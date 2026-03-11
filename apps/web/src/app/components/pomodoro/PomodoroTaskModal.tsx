import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useFocusTimer } from '../../context/FocusTimerContext';
import { AppButton, ModalSheet } from '../ui';
import { rem, extractPixels, fontWeight } from '../../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    modalTitle: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeight(fontWeights.bold),
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
    settings,
    isFocusCompleteModalOpen,
    submitTaskCompletionTime
  } = useFocusTimer();

  return (
    <ModalSheet
      isVisible={isFocusCompleteModalOpen}
      onClose={() => submitTaskCompletionTime(null)}
      title={t('pages.focus.focusCompleteModalTitle')}
      type="centered"
    >
      <View>
        <Text style={[styles.inputLabel, styles.description]}>
          {t('pages.focus.focusCompleteModalDesc')}
        </Text>

        <ScrollView style={styles.tasksList}>
          {settings?.tasks?.filter(t => !t.completed).map(task => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskModalButton}
              onPress={() => submitTaskCompletionTime(task.id)}
              accessibilityRole="button"
              accessibilityLabel={task.title}
            >
              <Text style={styles.taskModalButtonText}>{task.title}</Text>
            </TouchableOpacity>
          ))}
          {(!settings?.tasks || settings.tasks.filter(t => !t.completed).length === 0) && (
            <Text style={styles.emptyText}>
              {t('pages.focus.noTasksAvailable')}
            </Text>
          )}
        </ScrollView>

        <AppButton onPress={() => submitTaskCompletionTime(null)}>
          {t('common.skip')}
        </AppButton>
      </View>
    </ModalSheet>
  );
}
