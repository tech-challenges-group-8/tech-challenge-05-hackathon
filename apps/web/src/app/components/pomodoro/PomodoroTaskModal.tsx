import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useFocusTimer } from '../../context/FocusTimerContext';
import { rem, extractPixels } from '../../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: themeColors.background,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      width: '85%',
      maxWidth: 400,
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      textAlign: 'center',
    },
    inputLabel: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: rem(space[6]),
      gap: rem(space[4]),
    },
    button: {
      backgroundColor: themeColors.primary.DEFAULT,
      paddingVertical: rem(space[3]),
      paddingHorizontal: rem(space[6]),
      borderRadius: extractPixels(radii.full),
    },
    buttonText: {
      color: themeColors.primary.foreground,
      fontSize: rem(fontSizes.lg),
      fontWeight: fontWeights.semiBold as any,
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
    }
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
    <Modal visible={isFocusCompleteModalOpen} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('pages.focus.focusCompleteModalTitle', 'Focus Session Completed!')}</Text>
          <Text style={[styles.inputLabel, { textAlign: 'center', marginBottom: rem(space[4]) }]}>
            {t('pages.focus.focusCompleteModalDesc', 'Great job! If you were working on a specific task, you can assign this time to it below.')}
          </Text>

          <ScrollView style={{ maxHeight: 200, marginBottom: rem(space[4]) }}>
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
              <Text style={{ textAlign: 'center', color: theme.colors.muted.foreground }}>
                {t('pages.focus.noTasksAvailable', 'No active tasks to assign time to.')}
              </Text>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.button} onPress={() => submitTaskCompletionTime(null)}>
              <Text style={styles.buttonText}>{t('common.skip', 'Skip')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
