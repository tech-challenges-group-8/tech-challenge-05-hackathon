import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space, colors as uiColors } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import focusSettingsService from '../../../services/focus-settings/focusSettingsService';
import { useFocusTimer, extractYoutubeId } from '../../context/FocusTimerContext';
import type { AudioTheme } from '../../../services/focus-settings/types';
import { rem, extractPixels } from '../../../utils';

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: themeColors.background,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      width: '85%',
      maxWidth: 400,
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: rem(space[4]),
    },
    inputLabel: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    textInput: {
      backgroundColor: themeColors.card.DEFAULT,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      padding: rem(space[3]),
      fontSize: rem(fontSizes.md),
      color: themeColors.foreground,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: rem(space[6]),
      gap: rem(space[4]),
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
      fontWeight: fontWeights.medium as any,
      color: themeColors.muted.foreground,
    },
    modalTabTextActive: {
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeights.bold as any,
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
    button: {
      backgroundColor: themeColors.primary.DEFAULT,
      paddingVertical: rem(space[3]),
      paddingHorizontal: rem(space[6]),
      borderRadius: extractPixels(radii.full),
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
  });

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingsTab: 'timer' | 'audio';
  setSettingsTab: (tab: 'timer' | 'audio') => void;
}

export function PomodoroSettingsModal({ isOpen, onClose, settingsTab, setSettingsTab }: PomodoroSettingsModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  
  const {
    settings,
    mode,
    selectedThemeId,
    setSelectedThemeId,
    setSettings,
    handleModeSelect,
    youtubeUrl,
    setYoutubeUrl
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
    
    onClose();
    
    try {
      const updatedSettings = await focusSettingsService.setPomodoroDurations(
        newFocus, newShort, newLong
      );
      setSettings(updatedSettings);

      // Re-apply mode to update timer immediately
      handleModeSelect(mode);
    } catch (error) {
      console.error('Failed to save settings:', error);
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
    const updatedThemes = [...(settings?.audioThemes || []), newTheme];
    
    setSettings((prev: any) => prev ? { ...prev, audioThemes: updatedThemes } : null);
    setSelectedThemeId(newTheme.id); // Automatically select newly added track
    setNewAudioName('');
    setNewAudioUrl('');

    try {
      await focusSettingsService.updateAudioThemes(updatedThemes);
    } catch (e) {
      console.error('Failed to save audio theme');
    }
  };

  const handleDeleteAudioTheme = async (id: string) => {
    const updatedThemes = (settings?.audioThemes || []).filter((t: any) => t.id !== id);
    if (selectedThemeId === id) setSelectedThemeId('lofi');

    setSettings((prev: any) => prev ? { ...prev, audioThemes: updatedThemes } : null);
    try {
      await focusSettingsService.updateAudioThemes(updatedThemes);
    } catch (e) {
      console.error('Failed to delete audio theme');
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{t('pages.focus.settingsTitle', 'Settings')}</Text>

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
                  <Text style={styles.inputLabel}>{t('pages.focus.focusDuration', 'Focus Duration (minutes)')}</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={customFocus}
                    onChangeText={setCustomFocus}
                    placeholder="25"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('pages.focus.shortBreakDuration', 'Short Break Duration (minutes)')}</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={customShortBreak}
                    onChangeText={setCustomShortBreak}
                    placeholder="5"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('pages.focus.longBreakDuration', 'Long Break Duration (minutes)')}</Text>
                  <TextInput
                    style={styles.textInput}
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
                  <Text style={styles.inputLabel}>{t('pages.focus.audioName', 'Audio Name')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newAudioName}
                    onChangeText={setNewAudioName}
                    placeholder="e.g. Rock"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('pages.focus.audioUrl', 'YouTube URL')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newAudioUrl}
                    onChangeText={setNewAudioUrl}
                    placeholder="https://www.youtube.com/watch?v=..."
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <TouchableOpacity style={[styles.button, { marginBottom: rem(space[6]) }]} onPress={handleAddAudioTheme}>
                  <Text style={styles.buttonText}>{t('pages.focus.addAudio', 'Add Audio')}</Text>
                </TouchableOpacity>

                {selectedThemeId === 'custom' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('pages.focus.focusMusic', 'Focus Music (Custom YouTube URL)')}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={youtubeUrl}
                      onChangeText={setYoutubeUrl}
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
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]} 
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{t('common.cancel', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSaveSettings}
              >
                <Text style={styles.buttonText}>{t('common.save', 'Save')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
