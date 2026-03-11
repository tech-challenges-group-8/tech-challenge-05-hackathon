import React, { useState, useMemo } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useFocusTimer } from '../context/FocusTimerContext';
import { PomodoroAudioControls } from './pomodoro/PomodoroAudioControls';
import { PomodoroSettingsModal } from './pomodoro/PomodoroSettingsModal';
import { PomodoroTaskModal } from './pomodoro/PomodoroTaskModal';
import { AppButton } from './ui';
import { rem, extractPixels, formatTime, fontWeight } from '../../utils';

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
      fontWeight: fontWeight(fontWeights.bold),
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
    controlButton: {
      minWidth: 110,
      marginTop: 0,
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
      fontWeight: fontWeight(fontWeights.medium),
      color: themeColors.muted.foreground,
    },
    modeTabTextActive: {
      color: themeColors.primary.foreground,
      fontWeight: fontWeight(fontWeights.bold),
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

  if (!settings) {
    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>{t('common.loading')}</Text>
      </View>
    );
  }

  const isBreak = mode !== 'FOCUS';
  const webTimeLiveProps: Record<string, unknown> = Platform.OS === 'web' ? { 'aria-live': 'assertive' } : {};
  const webModeLiveProps: Record<string, unknown> = Platform.OS === 'web' ? { 'aria-live': 'polite' } : {};
  const currentModeLabel =
    mode === 'FOCUS'
      ? t('pages.focus.focusMode')
      : mode === 'SHORT_BREAK'
        ? t('pages.focus.shortBreak')
        : t('pages.focus.longBreak');
  const timerAccessibilityLabel = t('accessibility.pomodoro.timerCircle', {
    time: formatTime(timeLeft),
    mode: currentModeLabel,
  });

  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeSelector} accessibilityRole="tablist" accessibilityLabel={t('accessibility.pomodoro.modeSelector')}>
        <TouchableOpacity 
          style={[styles.modeTab, mode === 'FOCUS' && styles.modeTabActive]} 
          onPress={() => handleModeSelect('FOCUS')}
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'FOCUS' }}
          accessibilityLabel={t('pages.focus.focusMode')}
        >
          <Text style={[styles.modeTabText, mode === 'FOCUS' && styles.modeTabTextActive]}>
            {t('pages.focus.focusMode')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeTab, mode === 'SHORT_BREAK' && styles.modeTabActiveBreak]} 
          onPress={() => handleModeSelect('SHORT_BREAK')}
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'SHORT_BREAK' }}
          accessibilityLabel={t('pages.focus.shortBreak')}
        >
          <Text style={[styles.modeTabText, mode === 'SHORT_BREAK' && styles.modeTabTextActive]}>
            {t('pages.focus.shortBreak')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeTab, mode === 'LONG_BREAK' && styles.modeTabActiveBreak]} 
          onPress={() => handleModeSelect('LONG_BREAK')}
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'LONG_BREAK' }}
          accessibilityLabel={t('pages.focus.longBreak')}
        >
          <Text style={[styles.modeTabText, mode === 'LONG_BREAK' && styles.modeTabTextActive]}>
            {t('pages.focus.longBreak')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timer Display */}
      <View
        style={[styles.timerCircle, isBreak && styles.timerCircleBreak]}
        accessibilityLabel={timerAccessibilityLabel}
      >
        <Text
          style={styles.timeText}
          accessibilityLiveRegion="assertive"
          {...webTimeLiveProps}
        >
          {formatTime(timeLeft)}
        </Text>
        <Text
          style={styles.modeText}
          accessibilityLiveRegion="polite"
          {...webModeLiveProps}
        >
          {currentModeLabel}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <AppButton
          variant="ghost"
          style={styles.controlButton}
          onPress={resetTimer}
          accessibilityLabel={t('common.reset')}
        >
          {t('common.reset')}
        </AppButton>

        <AppButton
          variant={isBreak ? 'secondary' : 'primary'}
          style={styles.controlButton}
          onPress={toggleTimer}
          accessibilityLabel={isActive ? t('common.pause') : t('common.start')}
        >
          {isActive ? t('common.pause') : t('common.start')}
        </AppButton>

        <AppButton
          variant="ghost"
          style={styles.controlButton}
          onPress={skipTimer}
          accessibilityLabel={t('common.skip')}
        >
          {t('common.skip')}
        </AppButton>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text
          style={styles.statsText}
          accessibilityLabel={t('accessibility.pomodoro.completedSessions', { count: settings.pomodorosCompleted })}
        >
          {t('pages.focus.pomodorosCompleted')}: {settings.pomodorosCompleted}
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
        accessibilityRole="button"
        accessibilityLabel={t('pages.focus.customizeTimer')}
      >
        <Text style={styles.settingsButtonText}>
          {t('pages.focus.customizeTimer')}
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
