import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import focusSettingsService from '../../services/focus-settings/focusSettingsService';
import { useFocusTimer } from '../context/FocusTimerContext';
import { PomodoroAudioControls } from './pomodoro/PomodoroAudioControls';
import { PomodoroSettingsModal } from './pomodoro/PomodoroSettingsModal';
import { PomodoroTaskModal } from './pomodoro/PomodoroTaskModal';
import { rem, extractPixels } from '../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: rem(space[4]),
    },
    timerCircle: {
      width: 250,
      height: 250,
      borderRadius: 125,
      borderWidth: 8,
      borderColor: themeColors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: rem(space[8]),
      backgroundColor: themeColors.card.DEFAULT,
      shadowColor: themeColors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    },
    timerCircleBreak: {
      borderColor: themeColors.secondary.DEFAULT,
    },
    timeText: {
      fontSize: rem(fontSizes['4xl']),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
    },
    modeText: {
      fontSize: rem(fontSizes.lg),
      color: themeColors.muted.foreground,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginTop: rem(space[2]),
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[4]),
    },
    button: {
      backgroundColor: themeColors.primary.DEFAULT,
      paddingVertical: rem(space[3]),
      paddingHorizontal: rem(space[6]),
      borderRadius: extractPixels(radii.full),
    },
    buttonBreak: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    buttonSecondary: {
      backgroundColor: themeColors.muted.DEFAULT,
    },
    buttonText: {
      color: themeColors.primary.foreground,
      fontSize: rem(fontSizes.lg),
      fontWeight: fontWeights.semiBold as any,
    },
    buttonTextSecondary: {
      color: themeColors.muted.foreground,
    },
    statsContainer: {
      marginTop: rem(space[8]),
      padding: rem(space[4]),
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      alignItems: 'center',
    },
    statsText: {
      fontSize: rem(fontSizes.md),
      color: themeColors.foreground,
    },
    modeSelector: {
      flexDirection: 'row',
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.full),
      padding: rem(space[1]),
      marginBottom: rem(space[8]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    modeTab: {
      paddingVertical: rem(space[2]),
      paddingHorizontal: rem(space[4]),
      borderRadius: extractPixels(radii.full),
    },
    modeTabActive: {
      backgroundColor: themeColors.primary.DEFAULT,
    },
    modeTabActiveBreak: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    modeTabText: {
      fontSize: rem(fontSizes.sm),
      fontWeight: fontWeights.medium as any,
      color: themeColors.muted.foreground,
    },
    modeTabTextActive: {
      color: themeColors.primary.foreground,
      fontWeight: fontWeights.bold as any,
    },
    settingsButton: {
      marginTop: rem(space[4]),
      padding: rem(space[2]),
    },
    settingsButtonText: {
      color: themeColors.muted.foreground,
      fontSize: rem(fontSizes.sm),
      textDecorationLine: 'underline',
    },
  });

export function PomodoroTimer() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const {
    settings, timeLeft, isActive, mode,
    handleModeSelect,
    toggleTimer,
    resetTimer,
    skipTimer,
    rewindAudio,
  } = useFocusTimer();

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'timer' | 'audio'>('timer');

  const handleCustomURLClick = () => {
    setIsSettingsOpen(true);
    setSettingsTab('audio');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!settings) {
    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>{t('common.loading', 'Loading...')}</Text>
      </View>
    );
  }

  const isBreak = mode !== 'FOCUS';

  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity 
          style={[styles.modeTab, mode === 'FOCUS' && styles.modeTabActive]} 
          onPress={() => handleModeSelect('FOCUS')}
        >
          <Text style={[styles.modeTabText, mode === 'FOCUS' && styles.modeTabTextActive]}>
            {t('pages.focus.focusMode', 'Focus')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeTab, mode === 'SHORT_BREAK' && styles.modeTabActiveBreak]} 
          onPress={() => handleModeSelect('SHORT_BREAK')}
        >
          <Text style={[styles.modeTabText, mode === 'SHORT_BREAK' && styles.modeTabTextActive]}>
            {t('pages.focus.shortBreak', 'Short Break')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeTab, mode === 'LONG_BREAK' && styles.modeTabActiveBreak]} 
          onPress={() => handleModeSelect('LONG_BREAK')}
        >
          <Text style={[styles.modeTabText, mode === 'LONG_BREAK' && styles.modeTabTextActive]}>
            {t('pages.focus.longBreak', 'Long Break')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timer Display */}
      <View style={[styles.timerCircle, isBreak && styles.timerCircleBreak]}>
        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={resetTimer}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {t('common.reset', 'Reset')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isBreak && styles.buttonBreak, { paddingHorizontal: rem(space[10]) }]} 
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>
            {isActive ? t('common.pause', 'Pause') : t('common.start', 'Start')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={skipTimer}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {t('common.skip', 'Skip')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {t('pages.focus.pomodorosCompleted', 'Pomodoros Completed')}: {settings.pomodorosCompleted}
        </Text>
      </View>

      {/* Mini Music Player */}
      <PomodoroAudioControls 
        onCustomUrlClick={handleCustomURLClick}
        rewindAudio={rewindAudio}
      />
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setIsSettingsOpen(true)}
      >
        <Text style={styles.settingsButtonText}>
          {t('pages.focus.customizeTimer', 'Focus Mode Settings')}
        </Text>
      </TouchableOpacity>

      {/* Settings Modal */}
      <PomodoroSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
      />

      <PomodoroTaskModal />
    </View>
  );
}
