import { useCallback, useEffect, useState } from 'react';
import focusSettingsService from '../../services/focus-settings/focusSettingsService';
import type {
  AudioTheme,
  FocusTask,
  ResponseFocusSettingsDTO,
} from '../../services/focus-settings/types';
import { logger } from '../../utils';

export function useFocusSettings() {
  const [settings, setSettings] = useState<ResponseFocusSettingsDTO | null>(null);
  const [isFocusCompleteModalOpen, setIsFocusCompleteModalOpen] = useState(false);
  const [lastFocusDuration, setLastFocusDuration] = useState(25);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await focusSettingsService.getSettings();
        setSettings(data);
      } catch (error) {
        logger.error('Failed to load focus settings, falling back to defaults', error);
        setSettings(focusSettingsService.getDefaultSettings());
      }
    };

    loadSettings();
  }, []);

  const openFocusCompleteModal = useCallback((focusDurationInMinutes: number) => {
    setLastFocusDuration(focusDurationInMinutes);
    setIsFocusCompleteModalOpen(true);
  }, []);

  const closeFocusCompleteModal = useCallback(() => {
    setIsFocusCompleteModalOpen(false);
  }, []);

  const saveDurations = useCallback(
    async (focusDuration: number, shortBreakDuration: number, longBreakDuration: number) => {
      const updated = await focusSettingsService.setPomodoroDurations(
        focusDuration,
        shortBreakDuration,
        longBreakDuration,
      );
      setSettings(updated);
      return updated;
    },
    [],
  );

  const incrementPomodoroCount = useCallback(async () => {
    if (!settings) {
      return null;
    }

    try {
      const updated = await focusSettingsService.incrementPomodoroCount(settings.pomodorosCompleted);
      setSettings(updated);
      return updated;
    } catch (error) {
      const localUpdated = {
        ...settings,
        pomodorosCompleted: settings.pomodorosCompleted + 1,
      };
      setSettings(localUpdated);
      return localUpdated;
    }
  }, [settings]);

  const updateFocusTasks = useCallback(
    async (tasks: FocusTask[]) => {
      if (settings) {
        setSettings({ ...settings, tasks });
      }

      try {
        const updated = await focusSettingsService.updateTasks(tasks);
        setSettings(updated);
      } catch (error) {
        logger.error('Failed to sync tasks:', error);
      }
    },
    [settings],
  );

  const addAudioTheme = useCallback(
    async (theme: AudioTheme) => {
      const updatedThemes = [...(settings?.audioThemes || []), theme];
      if (settings) {
        setSettings({ ...settings, audioThemes: updatedThemes });
      }

      try {
        const updated = await focusSettingsService.updateAudioThemes(updatedThemes);
        setSettings(updated);
      } catch (error) {
        logger.error('Failed to save audio theme', error);
      }
    },
    [settings],
  );

  const deleteAudioTheme = useCallback(
    async (id: string) => {
      const updatedThemes = (settings?.audioThemes || []).filter((theme) => theme.id !== id);
      if (settings) {
        setSettings({ ...settings, audioThemes: updatedThemes });
      }

      try {
        const updated = await focusSettingsService.updateAudioThemes(updatedThemes);
        setSettings(updated);
      } catch (error) {
        logger.error('Failed to delete audio theme', error);
      }
    },
    [settings],
  );

  const submitTaskCompletionTime = useCallback(
    async (taskId: string | null) => {
      if (!taskId || !settings) {
        closeFocusCompleteModal();
        return;
      }

      const updatedTasks = settings.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            timeSpent: (task.timeSpent || 0) + lastFocusDuration,
            pomodoros: (task.pomodoros || 0) + 1,
          };
        }
        return task;
      });

      setSettings({ ...settings, tasks: updatedTasks });
      try {
        const updated = await focusSettingsService.updateTasks(updatedTasks);
        setSettings(updated);
      } catch (error) {
        logger.error('Could not save task time assignment', error);
      }

      closeFocusCompleteModal();
    },
    [settings, lastFocusDuration, closeFocusCompleteModal],
  );

  return {
    settings,
    isFocusCompleteModalOpen,
    lastFocusDuration,
    openFocusCompleteModal,
    closeFocusCompleteModal,
    saveDurations,
    incrementPomodoroCount,
    updateFocusTasks,
    addAudioTheme,
    deleteAudioTheme,
    submitTaskCompletionTime,
  };
}
