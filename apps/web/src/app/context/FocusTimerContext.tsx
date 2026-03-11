import React, { createContext, useContext, useMemo } from 'react';
import type { AudioTheme, FocusTask, ResponseFocusSettingsDTO } from '../../services/focus-settings/types';
import { useAudioPlayer, useFocusSettings, usePomodoro } from '../hooks';
import type { TimerMode } from '../hooks/usePomodoro';
import { extractYoutubeId, YOUTUBE_THEMES, CUSTOM_THEME_OPTION } from '../hooks/useAudioPlayer';

export { extractYoutubeId, YOUTUBE_THEMES, CUSTOM_THEME_OPTION };
export type { TimerMode };

export interface FocusTimerContextData {
  settings: ResponseFocusSettingsDTO | null;
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  selectedThemeId: string;
  youtubeUrl: string;
  activeVideoId: string | null;
  isAudioPlaying: boolean;
  audioVolume: number;
  allThemes: Array<{ id: string; name: string; videoId: string }>;
  isFocusCompleteModalOpen: boolean;
  lastFocusDuration: number;
  isFloatingPlayerDismissed: boolean;
  playerRef: React.RefObject<any>;

  toggleTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  handleModeSelect: (newMode: TimerMode) => void;
  toggleAudioPlay: () => void;
  closeFocusCompleteModal: () => void;
  submitTaskCompletionTime: (taskId: string | null) => Promise<void>;
  rewindAudio: () => void;
  playNextTheme: () => void;
  dismissFloatingPlayer: () => void;
  showFloatingPlayer: () => void;

  selectTheme: (themeId: string) => void;
  setCustomYoutubeUrl: (url: string) => void;
  setVolume: (volume: number) => void;
  changeVolume: (delta: number) => void;

  saveTimerDurations: (
    focusDuration: number,
    shortBreakDuration: number,
    longBreakDuration: number,
  ) => Promise<void>;
  updateFocusTasks: (tasks: FocusTask[]) => Promise<void>;
  addAudioTheme: (theme: AudioTheme) => Promise<void>;
  deleteAudioTheme: (id: string) => Promise<void>;
}

const FocusTimerContext = createContext<FocusTimerContextData | undefined>(undefined);

export const FocusTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
  } = useFocusSettings();

  const {
    timeLeft,
    isActive,
    mode,
    toggleTimer,
    resetTimer,
    skipTimer,
    handleModeSelect,
  } = usePomodoro({
    settings,
    onFocusSessionCompleted: openFocusCompleteModal,
    incrementPomodoroCount,
  });

  const {
    selectedThemeId,
    youtubeUrl,
    activeVideoId,
    isAudioPlaying,
    audioVolume,
    isFloatingPlayerDismissed,
    allThemes,
    playerRef,
    toggleAudioPlay,
    rewindAudio,
    playNextTheme,
    selectTheme,
    setCustomYoutubeUrl,
    setVolume,
    changeVolume,
    dismissFloatingPlayer,
    showFloatingPlayer,
  } = useAudioPlayer({
    settings,
    isActive,
    mode,
  });

  const saveTimerDurations = async (
    focusDuration: number,
    shortBreakDuration: number,
    longBreakDuration: number,
  ) => {
    await saveDurations(focusDuration, shortBreakDuration, longBreakDuration);
    handleModeSelect(mode);
  };

  const wrappedToggleTimer = () => {
    showFloatingPlayer();
    toggleTimer();
  };

  const wrappedHandleModeSelect = (newMode: TimerMode) => {
    showFloatingPlayer();
    handleModeSelect(newMode);
  };

  const contextValue = useMemo<FocusTimerContextData>(
    () => ({
      settings,
      timeLeft,
      isActive,
      mode,
      selectedThemeId,
      youtubeUrl,
      activeVideoId,
      isAudioPlaying,
      audioVolume,
      allThemes,
      isFocusCompleteModalOpen,
      lastFocusDuration,
      isFloatingPlayerDismissed,
      playerRef,
      toggleTimer: wrappedToggleTimer,
      resetTimer,
      skipTimer,
      handleModeSelect: wrappedHandleModeSelect,
      toggleAudioPlay,
      closeFocusCompleteModal,
      submitTaskCompletionTime,
      rewindAudio,
      playNextTheme,
      dismissFloatingPlayer,
      showFloatingPlayer,
      selectTheme,
      setCustomYoutubeUrl,
      setVolume,
      changeVolume,
      saveTimerDurations,
      updateFocusTasks,
      addAudioTheme,
      deleteAudioTheme,
    }),
    [
      settings,
      timeLeft,
      isActive,
      mode,
      selectedThemeId,
      youtubeUrl,
      activeVideoId,
      isAudioPlaying,
      audioVolume,
      allThemes,
      isFocusCompleteModalOpen,
      lastFocusDuration,
      isFloatingPlayerDismissed,
      playerRef,
      resetTimer,
      skipTimer,
      toggleAudioPlay,
      closeFocusCompleteModal,
      submitTaskCompletionTime,
      rewindAudio,
      playNextTheme,
      dismissFloatingPlayer,
      showFloatingPlayer,
      selectTheme,
      setCustomYoutubeUrl,
      setVolume,
      changeVolume,
      updateFocusTasks,
      addAudioTheme,
      deleteAudioTheme,
    ],
  );

  return <FocusTimerContext.Provider value={contextValue}>{children}</FocusTimerContext.Provider>;
};

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider');
  }
  return context;
};
