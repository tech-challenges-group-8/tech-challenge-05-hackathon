import React, { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels } from '../../../utils';
import { useTaskList } from '../../hooks';
import { TaskItem } from './TaskItem';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: rem(space[4]),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: rem(space[6]),
    },
    headerTitle: {
      fontSize: rem(fontSizes['2xl']) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    headerSubtitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      marginTop: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    addButton: {
      backgroundColor: themeColors.primary.DEFAULT,
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      borderRadius: extractPixels(radii.md),
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[2]),
    },
    addButtonText: {
      color: themeColors.primary.foreground,
      fontWeight: fontWeights.semiBold as any,
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    completionMessage: {
      backgroundColor: themeColors.secondary.DEFAULT,
      color: themeColors.primary.DEFAULT,
      padding: rem(space[3]),
      borderRadius: extractPixels(radii.lg),
      textAlign: 'center',
      marginBottom: rem(space[4]),
    },
    progressCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[4]),
      marginBottom: rem(space[4]),
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: rem(space[2]),
    },
    progressLabel: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeights.medium as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    progressCount: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    progressBarContainer: {
      height: rem(space[2]),
      backgroundColor: themeColors.muted.DEFAULT,
      borderRadius: extractPixels(radii.full),
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: themeColors.primary.DEFAULT,
      borderRadius: extractPixels(radii.full),
    },
    addCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[4]),
      marginBottom: rem(space[4]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: preferences.simpleInterface ? 0 : 0.1,
      shadowRadius: preferences.simpleInterface ? 0 : 4,
      elevation: preferences.simpleInterface ? 0 : 3,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      backgroundColor: themeColors.background,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    addButtonsContainer: {
      flexDirection: 'row',
      gap: rem(space[2]),
      marginTop: rem(space[3]),
    },
    listCard: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
    },
    listHeader: {
      padding: rem(space[4]),
      paddingBottom: rem(space[3]),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listTitle: {
      fontSize: rem(fontSizes.xl) * preferences.fontScale,
      fontWeight: fontWeights.medium as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    clearButtonText: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    listContent: {
      padding: rem(space[2]),
    },
    emptyListContainer: {
      alignItems: 'center',
      paddingVertical: rem(space[8]),
    },
    emptyListText: {
      color: themeColors.muted.foreground,
      marginTop: rem(space[3]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    emptyListSubtext: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    encouragementText: {
      textAlign: 'center',
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      marginTop: rem(space[4]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    successText: {
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeights.medium as any,
    },
  });

export function TaskList() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  const {
    tasks,
    isLoading,
    completionMessage,
    completedCount,
    totalCount,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTaskList();

  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);

  useEffect(() => {
    // Tasks are fetched automatically by the hook
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('tasks.list.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('tasks.list.subtitle')}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <Ionicons name="add" size={16} color={theme.colors.primary.foreground} />
          <Text style={styles.addButtonText}>{t('tasks.list.newTask')}</Text>
        </TouchableOpacity>
      </View>

      {completionMessage && <Text style={styles.completionMessage}>{completionMessage}</Text>}

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{t('tasks.list.progress')}</Text>
          <Text style={styles.progressCount}>
            {completedCount} de {totalCount}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` },
            ]}
          />
        </View>
      </View>

      {isAdding && (
        <View style={styles.addCard}>
          <TextInput
            style={styles.input}
            placeholder={t('tasks.list.placeholder')}
            placeholderTextColor={theme.colors.muted.foreground}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
            autoFocus
          />
          <View style={styles.addButtonsContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Text style={styles.addButtonText}>{t('common.add')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsAdding(false);
                setNewTaskTitle('');
              }}
            >
              <Text style={{ color: theme.colors.muted.foreground, padding: rem(space[3]) }}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{t('tasks.list.tasks')}</Text>
          {completedCount > 0 && (
            <TouchableOpacity onPress={clearCompleted}>
              <Text style={styles.clearButtonText}>
                {t('tasks.list.clearCompleted')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.listContent}>
          {tasks.length === 0 ? (
            <View style={styles.emptyListContainer}>
              <Ionicons
                name="ellipse-outline"
                size={48}
                color={theme.colors.muted.foreground}
                style={{ opacity: 0.3 }}
              />
              <Text style={styles.emptyListText}>
                {t('tasks.list.noTasks')}
              </Text>
              <Text style={styles.emptyListSubtext}>
                {t('tasks.list.addFirst')}
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          )}
        </View>
      </View>

      {completedCount > 0 && (
        <Text style={styles.encouragementText}>
          {completedCount === totalCount && totalCount > 0 ? (
            <Text style={styles.successText}>
              {t('tasks.list.allDone')}
            </Text>
          ) : (
            <Text>
              {t('tasks.list.keepGoing')}
            </Text>
          )}
        </Text>
      )}
    </ScrollView>
  );
}
