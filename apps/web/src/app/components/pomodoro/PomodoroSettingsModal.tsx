import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space, colors as uiColors } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useFocusTimer, extractYoutubeId } from '../../context/FocusTimerContext';
import type { AudioTheme } from '../../../services/focus-settings/types';
import { AppButton, AppTextInput, ModalSheet } from '../ui';
import { rem, extractPixels, fontWeight, logger } from '../../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    inputLabel: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    modalActions: {
      flexDirection: 'row',
      gap: rem(space[3]),
    },
    modalTabs: {
      flexDirection: 'row',
      marginBottom: rem(space[4]),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    modalTab: {
      flex: 1,
      paddingVertical: rem(space[2]),
      alignItems: 'center',
    },
    modalTabActive: {
      borderBottomWidth: 2,
      borderBottomColor: themeColors.primary.DEFAULT,
    },
    modalTabText: {
      fontSize: rem(fontSizes.sm),
      fontWeight: fontWeight(fontWeights.medium),
      color: themeColors.muted.foreground,
    },
    modalTabTextActive: {
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeight(fontWeights.bold),
    },
    inputGroup: {
      marginBottom: rem(space[2]),
    },
    themePillText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
    },
    themePillDelete: {
      marginLeft: rem(space[2]),
      padding: rem(space[1]),
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
    halfButton: {
      flex: 1,
      marginTop: 0,
    },
  });

interface PomodoroSettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly settingsTab: 'timer' | 'audio';
  readonly setSettingsTab: (tab: 'timer' | 'audio') => void;
}

export function PomodoroSettingsModal({ isOpen, onClose, settingsTab, setSettingsTab }: PomodoroSettingsModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  
  const {
    settings,
    selectedThemeId,
    selectTheme,
    youtubeUrl,
    setCustomYoutubeUrl,
    saveTimerDurations,
    addAudioTheme,
    deleteAudioTheme,
  } = useFocusTimer();

  const [customFocus, setCustomFocus] = useState('25');
  const [customShortBreak, setCustomShortBreak] = useState('5');
  const [customLongBreak, setCustomLongBreak] = useState('15');
  const [newAudioName, setNewAudioName] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');

  useEffect(() => {
    if (settings) {
      setCustomFocus(settings.foco.toString());
      setCustomShortBreak(settings.pausaCurta.toString());
      setCustomLongBreak(settings.pausaLonga.toString());
    }
  }, [settings?.foco, settings?.pausaCurta, settings?.pausaLonga]);

  const handleSaveSettings = async () => {
    const newFocus = Number(customFocus) || 25;
    const newShort = Number(customShortBreak) || 5;
    const newLong = Number(customLongBreak) || 15;

    try {
      await saveTimerDurations(newFocus, newShort, newLong);
      onClose();
    } catch (error) {
      logger.error('Failed to save settings:', error);
    }
  };

  const handleAddAudioTheme = async () => {
    if (!newAudioName.trim() || !newAudioUrl.trim()) return;
    const videoId = extractYoutubeId(newAudioUrl);
    if (!videoId) return;

    const newTheme = {
      id: Date.now().toString(),
      name: newAudioName.trim(),
      videoId
    };
    await addAudioTheme(newTheme);
    selectTheme(newTheme.id);
    setNewAudioName('');
    setNewAudioUrl('');
  };

  const handleDeleteAudioTheme = async (id: string) => {
    if (selectedThemeId === id) {
      selectTheme('lofi');
    }

    await deleteAudioTheme(id);
  };

  return (
    <ModalSheet
      isVisible={isOpen}
      onClose={onClose}
      title={t('pages.focus.settingsTitle', 'Settings')}
      type="centered"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.modalTabs}>
          <TouchableOpacity onPress={() => setSettingsTab('timer')} style={[styles.modalTab, settingsTab === 'timer' && styles.modalTabActive]}>
            <Text style={[styles.modalTabText, settingsTab === 'timer' && styles.modalTabTextActive]}>{t('pages.focus.settingsTabTimer', 'Durations')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingsTab('audio')} style={[styles.modalTab, settingsTab === 'audio' && styles.modalTabActive]}>
            <Text style={[styles.modalTabText, settingsTab === 'audio' && styles.modalTabTextActive]}>{t('pages.focus.settingsTabAudio', 'Audio & Player')}</Text>
          </TouchableOpacity>
        </View>

        {settingsTab === 'timer' ? (
          <>
            <View style={styles.inputGroup}>
              <AppTextInput
                label={t('pages.focus.focusDuration', 'Focus Duration (minutes)')}
                keyboardType="numeric"
                value={customFocus}
                onChangeText={setCustomFocus}
                placeholder="25"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppTextInput
                label={t('pages.focus.shortBreakDuration', 'Short Break Duration (minutes)')}
                keyboardType="numeric"
                value={customShortBreak}
                onChangeText={setCustomShortBreak}
                placeholder="5"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppTextInput
                label={t('pages.focus.longBreakDuration', 'Long Break Duration (minutes)')}
                keyboardType="numeric"
                value={customLongBreak}
                onChangeText={setCustomLongBreak}
                placeholder="15"
              />
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.inputLabel, { fontWeight: 'bold' }]}>{t('pages.focus.addCustomAudio', 'Add Custom Audio')}</Text>

            <View style={styles.inputGroup}>
              <AppTextInput
                label={t('pages.focus.audioName', 'Audio Name')}
                value={newAudioName}
                onChangeText={setNewAudioName}
                placeholder="e.g. Rock"
              />
            </View>
            <View style={styles.inputGroup}>
              <AppTextInput
                label={t('pages.focus.audioUrl', 'YouTube URL')}
                value={newAudioUrl}
                onChangeText={setNewAudioUrl}
                placeholder="https://www.youtube.com/watch?v=..."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <AppButton style={{ marginBottom: rem(space[4]) }} onPress={handleAddAudioTheme}>
              {t('pages.focus.addAudio', 'Add Audio')}
            </AppButton>

            {selectedThemeId === 'custom' && (
              <View style={styles.inputGroup}>
                <AppTextInput
                  label={t('pages.focus.focusMusic', 'Focus Music (Custom YouTube URL)')}
                  value={youtubeUrl}
                  onChangeText={setCustomYoutubeUrl}
                  placeholder="https://www.youtube.com/watch?v=..."
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}
          </>
        )}

        {settingsTab === 'audio' && (settings?.audioThemes || []).length > 0 && (
          <View style={[styles.inputGroup, { marginTop: rem(space[4]) }]}>
            <Text style={[styles.inputLabel, { fontWeight: 'bold' }]}>{t('pages.focus.myCustomAudios', 'My Custom Audios')}</Text>
            {(settings?.audioThemes || []).map((audioTheme: AudioTheme) => (
              <View key={audioTheme.id} style={[styles.themePill, { flexDirection: 'row', justifyContent: 'space-between', marginBottom: rem(space[2]), borderWidth: 1 }]}>
                <Text style={[styles.themePillText, { padding: rem(space[1]) }]}>{audioTheme.name}</Text>
                <TouchableOpacity style={styles.themePillDelete} onPress={() => handleDeleteAudioTheme(audioTheme.id)}>
                  <Ionicons name="trash" size={16} color={uiColors.destructive.DEFAULT} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.modalActions}>
          <AppButton variant="ghost" style={styles.halfButton} onPress={onClose}>
            {t('common.cancel', 'Cancel')}
          </AppButton>
          <AppButton style={styles.halfButton} onPress={handleSaveSettings}>
            {t('common.save', 'Save')}
          </AppButton>
        </View>
      </ScrollView>
    </ModalSheet>
  );
}
