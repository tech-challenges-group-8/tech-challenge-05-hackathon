import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import focusSettingsService from '../../services/focus-settings/focusSettingsService';
import type { FocusTask } from '../../services/focus-settings/types';
import { useFocusTimer } from '../context/FocusTimerContext';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

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
      fontWeight: fontWeights.bold as any,
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
      fontWeight: fontWeights.bold as any,
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
      fontWeight: fontWeights.medium as any,
    },
    deleteButton: {
      padding: rem(space[1]),
    },
    deleteButtonText: {
      color: themeColors.accent.foreground,
      fontWeight: fontWeights.bold as any,
    },
  });

export function TaskList() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const [newTaskText, setNewTaskText] = useState('');
  const { settings, setSettings } = useFocusTimer();

  const tasks = settings?.tasks || [];

  const syncTasks = async (newTasks: FocusTask[]) => {
    if (settings) {
      setSettings({ ...settings, tasks: newTasks });
    }
    try {
      await focusSettingsService.updateTasks(newTasks);
    } catch (error) {
      console.error('Failed to sync tasks:', error);
    }
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
      <Text style={styles.title}>{t('pages.focus.tasks', 'Focus Tasks')}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder={t('pages.focus.addTask', 'Add a task to focus on...')}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList}>
        {!settings ? (
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} style={{ marginTop: 20 }} />
        ) : (
          tasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <TouchableOpacity 
                style={[styles.checkbox, task.completed && styles.checkboxChecked]} 
                onPress={() => toggleTask(task.id)}
              />
              <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                {task.title}
              </Text>
              <Text style={styles.pomodoroCount}>
                🍅 {task.pomodoros || 0}
              </Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(task.id)}>
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
