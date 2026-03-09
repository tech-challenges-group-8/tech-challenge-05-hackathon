import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space, colors as uiColors } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useFocusTimer } from '../../context/FocusTimerContext';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    miniPlayer: {
      width: '100%',
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[4]),
      marginTop: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    miniPlayerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: rem(space[3]),
    },
    miniPlayerTitle: {
      fontSize: rem(fontSizes.md),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
    },
    themesScroll: {
      marginBottom: rem(space[4]),
    },
    themePill: {
      paddingVertical: rem(space[1]),
      paddingHorizontal: rem(space[3]),
      borderRadius: extractPixels(radii.full),
      backgroundColor: themeColors.background,
      marginRight: rem(space[2]),
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    themePillActive: {
      backgroundColor: themeColors.primary.DEFAULT,
      borderColor: themeColors.primary.DEFAULT,
    },
    themePillText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
    },
    themePillTextActive: {
      color: themeColors.primary.foreground,
      fontWeight: fontWeights.bold as any,
    },
    audioControlsContainer: {
      flexDirection: 'column', 
      gap: rem(space[4]),
    },
    audioControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: rem(space[6]),
    },
    audioButton: {
      padding: rem(space[2]),
      borderRadius: extractPixels(radii.full),
      backgroundColor: themeColors.background,
    },
    audioButtonPrimary: {
      padding: rem(space[3]),
      borderRadius: extractPixels(radii.full),
      backgroundColor: themeColors.foreground,
    },
    volumeControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[3]),
    },
    volumeBtn: {
      padding: rem(space[1]),
      backgroundColor: themeColors.background,
      borderRadius: extractPixels(radii.md),
      borderWidth: 1,
      borderColor: themeColors.border,
    },
  });

interface PomodoroAudioControlsProps {
  onCustomUrlClick: () => void;
  rewindAudio: () => void;
}

export function PomodoroAudioControls({ onCustomUrlClick, rewindAudio }: PomodoroAudioControlsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  
  const {
    allThemes,
    selectedThemeId,
    setSelectedThemeId,
    isAudioPlaying,
    toggleAudioPlay,
    audioVolume,
    setAudioVolume
  } = useFocusTimer();

  const playNextTheme = () => {
    const currentIndex = allThemes.findIndex(t => t.id === selectedThemeId);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= allThemes.length) {
      nextIndex = 0;
    }
    const nextTheme = allThemes[nextIndex];
    setSelectedThemeId(nextTheme.id);
  };

  return (
    <View style={styles.miniPlayer}>
      <View style={styles.miniPlayerHeader}>
        <Text style={styles.miniPlayerTitle}>{t('pages.focus.musicPlayer', 'Focus Audio')}</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themesScroll}>
        {allThemes.map(themeItem => (
          <TouchableOpacity 
            key={themeItem.id}
            style={[styles.themePill, selectedThemeId === themeItem.id && styles.themePillActive]}
            onPress={() => themeItem.id === 'custom' ? onCustomUrlClick() : setSelectedThemeId(themeItem.id)}
          >
            <Text style={[styles.themePillText, selectedThemeId === themeItem.id && styles.themePillTextActive]}>
              {themeItem.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.audioControlsContainer}>
        {/* Volume Controls on their own row for mobile-friendly layout */}
        <View style={styles.volumeControls}>
          <TouchableOpacity onPress={() => setAudioVolume(Math.max(0, audioVolume - 10))} style={styles.volumeBtn}>
              <Ionicons name="volume-low" size={20} color={theme.colors.foreground} />
          </TouchableOpacity>
          <Slider
            style={{ flex: 1, height: 20 }}
            minimumValue={0}
            maximumValue={100}
            value={audioVolume}
            onSlidingComplete={setAudioVolume}
            minimumTrackTintColor={theme.colors.primary.DEFAULT}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary.DEFAULT}
          />
          <TouchableOpacity onPress={() => setAudioVolume(Math.min(100, audioVolume + 10))} style={styles.volumeBtn}>
              <Ionicons name="volume-high" size={20} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Playback Controls below volume */}
        <View style={styles.audioControls}>
          <TouchableOpacity onPress={rewindAudio} style={styles.audioButton}>
            <Ionicons name="play-back" size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleAudioPlay} style={styles.audioButtonPrimary}>
            <Ionicons name={isAudioPlaying ? "pause" : "play"} size={24} color={theme.colors.card.DEFAULT} />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNextTheme} style={styles.audioButton}>
            <Ionicons name="play-forward" size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
