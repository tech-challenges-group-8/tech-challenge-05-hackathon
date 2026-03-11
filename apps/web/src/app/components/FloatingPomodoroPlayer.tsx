import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useFocusTimer } from '../context/FocusTimerContext';
import { rem, extractPixels, formatTime, fontWeight } from '../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: rem(space[6]),
      right: rem(space[6]),
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[3]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: themeColors.border,
      flexDirection: 'column',
      minWidth: 200,
      zIndex: 50,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: rem(space[2]),
    },
    title: {
      fontSize: rem(fontSizes.sm),
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.muted.foreground,
    },
    closeButton: {
      padding: 2,
    },
    mainRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timerText: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.foreground,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[2]),
    },
    iconButton: {
      padding: rem(space[1]),
    },
    playBtn: {
      backgroundColor: themeColors.primary.DEFAULT,
      borderRadius: extractPixels(radii.full),
      padding: rem(space[1]),
    },
    navButton: {
      marginTop: rem(space[2]),
      paddingVertical: rem(space[1]),
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    navButtonText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeight(fontWeights.semiBold),
    }
  });

interface Props {
  readonly onNavigateToFocus?: () => void;
}

export function FloatingPomodoroPlayer({ onNavigateToFocus }: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  
  const {
    timeLeft, isActive, mode, allThemes, selectedThemeId,
    toggleTimer, selectTheme, isAudioPlaying, toggleAudioPlay,
    dismissFloatingPlayer
  } = useFocusTimer();

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dismissFloatingPlayer();
      // Reset animation value for next time it appears
      fadeAnim.setValue(1);
    });
  };

  const playNextTheme = () => {
    const currentIndex = allThemes.findIndex(t => t.id === selectedThemeId);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= allThemes.length) {
      nextIndex = 0;
    }
    const nextTheme = allThemes[nextIndex];
    if (nextTheme.id !== 'custom') {
      selectTheme(nextTheme.id);
    } else {
        // Skip custom if empty? In floating player just skip over custom
        nextIndex = (nextIndex + 1) % allThemes.length;
        selectTheme(allThemes[nextIndex].id);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === 'FOCUS' ? t('pages.focus.focusMode') : t('pages.focus.shortBreak')}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} accessibilityLabel={t('common.close')}>
          <Ionicons name="close" size={16} color={theme.colors.muted.foreground} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainRow}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleAudioPlay} style={styles.iconButton} accessibilityLabel={t('pages.focus.musicPlayer')}>
            <Ionicons name={isAudioPlaying ? "volume-high" : "volume-mute"} size={18} color={theme.colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextTheme} style={styles.iconButton} accessibilityLabel={t('common.next')}>
            <Ionicons name="play-forward" size={18} color={theme.colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTimer} style={styles.playBtn} accessibilityLabel={isActive ? t('common.pause') : t('common.start')}>
            <Ionicons name={isActive ? "pause" : "play"} size={20} color={theme.colors.primary.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {onNavigateToFocus && (
        <TouchableOpacity style={styles.navButton} onPress={onNavigateToFocus}>
          <Text style={styles.navButtonText}>{t('pages.focus.openFocusApp')}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
