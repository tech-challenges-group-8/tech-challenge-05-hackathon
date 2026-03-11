import React, { useState, useMemo } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import type { FocusTask } from '../../services/focus-settings/types';
import { useFocusTimer } from '../context/FocusTimerContext';
import { rem, extractPixels, fontWeight } from '../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[4]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      maxHeight: 300,
    },
    title: {
      fontSize: rem(fontSizes.lg),
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: rem(space[4]),
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      padding: rem(space[2]),
      color: themeColors.foreground,
      backgroundColor: themeColors.background,
    },
    addButton: {
      backgroundColor: themeColors.primary.DEFAULT,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: rem(space[4]),
      borderRadius: extractPixels(radii.md),
      marginLeft: rem(space[2]),
    },
    addButtonText: {
      color: themeColors.primary.foreground,
      fontWeight: fontWeight(fontWeights.bold),
    },
    taskList: {
      flex: 1,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: rem(space[2]),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: themeColors.primary.DEFAULT,
      marginRight: rem(space[3]),
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: themeColors.primary.DEFAULT,
    },
    taskText: {
      flex: 1,
      fontSize: rem(fontSizes.md),
      color: themeColors.foreground,
    },
    taskTextCompleted: {
      textDecorationLine: 'line-through',
      color: themeColors.muted.foreground,
    },
    pomodoroCount: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.muted.foreground,
      marginRight: rem(space[3]),
      fontWeight: fontWeight(fontWeights.medium),
    },
    deleteButton: {
      padding: rem(space[1]),
    },
    deleteButtonText: {
      color: themeColors.accent.foreground,
      fontWeight: fontWeight(fontWeights.bold),
    },
    loadingIndicator: {
      marginTop: 20,
    },
  });

export function FocusTaskList() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const [newTaskText, setNewTaskText] = useState('');
  const { settings, updateFocusTasks } = useFocusTimer();

  const tasks = settings?.tasks || [];
  const webPoliteLiveProps: Record<string, unknown> = Platform.OS === 'web' ? { 'aria-live': 'polite' } : {};

  const syncTasks = async (newTasks: FocusTask[]) => {
    await updateFocusTasks(newTasks);
  };

  const addTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: FocusTask = {
      id: Date.now().toString(),
      title: newTaskText.trim(),
      completed: false,
    };
    syncTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    syncTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    syncTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('pages.focus.tasks')}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder={t('pages.focus.addTask')}
          onSubmitEditing={addTask}
          accessibilityLabel={t('accessibility.focus.newTaskInput')}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask} accessibilityLabel={t('common.add')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList}>
        {!settings ? (
          <View accessibilityLiveRegion="polite" {...webPoliteLiveProps}>
            <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} style={styles.loadingIndicator} />
            <Text>{t('common.loading')}</Text>
          </View>
        ) : (
          tasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <TouchableOpacity 
                style={[styles.checkbox, task.completed && styles.checkboxChecked]} 
                onPress={() => toggleTask(task.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                accessibilityLabel={task.title}
              />
              <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                {task.title}
              </Text>
              <Text
                style={styles.pomodoroCount}
                accessibilityLabel={t('accessibility.focus.pomodorosCount', { count: task.pomodoros || 0 })}
              >
                {t('accessibility.focus.pomodorosShort', { count: task.pomodoros || 0 })}
              </Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(task.id)} accessibilityLabel={t('common.delete')}>
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
