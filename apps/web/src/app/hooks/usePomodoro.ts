import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { ResponseFocusSettingsDTO } from '../../services/focus-settings/types';

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

const getModeDurationInSeconds = (
  mode: TimerMode,
  settings: ResponseFocusSettingsDTO,
): number => {
  switch (mode) {
    case 'FOCUS':
      return settings.foco * 60;
    case 'SHORT_BREAK':
      return settings.pausaCurta * 60;
    case 'LONG_BREAK':
      return settings.pausaLonga * 60;
    default:
      return settings.foco * 60;
  }
};

interface UsePomodoroOptions {
  settings: ResponseFocusSettingsDTO | null;
  onFocusSessionCompleted: (focusDurationInMinutes: number) => void;
  incrementPomodoroCount: () => Promise<ResponseFocusSettingsDTO | null>;
}

export function usePomodoro({
  settings,
  onFocusSessionCompleted,
  incrementPomodoroCount,
}: UsePomodoroOptions) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('FOCUS');

  useEffect(() => {
    if (!settings || isActive) {
      return;
    }

    setTimeLeft((prevTime) => (prevTime > 0 ? prevTime : getModeDurationInSeconds(mode, settings)));
  }, [settings, mode, isActive]);

  const handleModeSelect = useCallback(
    (newMode: TimerMode) => {
      if (!settings) {
        return;
      }

      setMode(newMode);
      setIsActive(false);
      setTimeLeft(getModeDurationInSeconds(newMode, settings));
    },
    [settings],
  );

  const resetTimer = useCallback(() => {
    if (!settings) {
      return;
    }

    setIsActive(false);
    setTimeLeft(getModeDurationInSeconds(mode, settings));
  }, [settings, mode]);

  const toggleTimer = useCallback(() => {
    setIsActive((current) => !current);
  }, []);

  const skipTimer = useCallback(() => {
    setTimeLeft(0);
  }, []);

  const handleTimerComplete = useCallback(async () => {
    setIsActive(false);

    if (Platform.OS === 'web' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Time is up!', {
          body:
            mode === 'FOCUS'
              ? 'Great job! Time for a break.'
              : 'Break is over! Ready to focus?',
        });
      }
    }

    if (!settings) {
      return;
    }

    if (mode === 'FOCUS') {
      onFocusSessionCompleted(settings.foco);

      const updatedSettings = await incrementPomodoroCount();
      const data = updatedSettings || settings;
      const isLongBreak = data.pomodorosCompleted % 4 === 0;
      const nextMode: TimerMode = isLongBreak ? 'LONG_BREAK' : 'SHORT_BREAK';

      setMode(nextMode);
      setTimeLeft(getModeDurationInSeconds(nextMode, data));
      return;
    }

    setMode('FOCUS');
    setTimeLeft(getModeDurationInSeconds('FOCUS', settings));
  }, [mode, settings, onFocusSessionCompleted, incrementPomodoroCount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  return {
    timeLeft,
    isActive,
    mode,
    toggleTimer,
    resetTimer,
    skipTimer,
    handleModeSelect,
  };
}
