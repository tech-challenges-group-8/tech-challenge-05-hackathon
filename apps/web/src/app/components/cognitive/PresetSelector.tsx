import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences, type CognitivePreset, type CognitiveSettingsState } from '../../../cognitive';
import { OptionButton } from '../ui';
import { useTheme } from '../../../theme';
import { rem, extractPixels, fontWeight } from '../../../utils';

interface PresetSelectorProps {
  readonly currentPreset: CognitivePreset | null;
  readonly settings: CognitiveSettingsState;
  readonly isDesktop: boolean;
  readonly applyPreset: (preset: CognitivePreset) => void;
}

const createStyles = (
  isDesktop: boolean,
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    group: {
      gap: rem(space[3]),
    },
    segmentRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: rem(space[2]),
    },
    optionWrapper: {
      width: isDesktop ? '32%' : '48%',
    },
    summaryCard: {
      borderRadius: extractPixels(radii.md),
      backgroundColor: themeColors.card.DEFAULT,
      padding: rem(space[4]),
      gap: rem(space[2]),
    },
    summaryTitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.semiBold),
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    summaryText: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      lineHeight: rem(fontSizes.xs) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function PresetSelector({ currentPreset, settings, isDesktop, applyPreset }: PresetSelectorProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(
    () => createStyles(isDesktop, theme.colors, preferences),
    [isDesktop, theme.colors, preferences],
  );
  const webRadioGroupProps: Record<string, unknown> = Platform.OS === 'web'
    ? { role: 'radiogroup' }
    : {};

  const presetOptions: { id: CognitivePreset; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'default', icon: 'sparkles-outline' },
    { id: 'reading', icon: 'book-outline' },
    { id: 'focus', icon: 'eye-outline' },
    { id: 'sensory', icon: 'color-palette-outline' },
    { id: 'emotion', icon: 'heart-outline' },
  ];

  const themeLabelKey =
    settings.themeMode === 'soft-pastel'
      ? 'softPastel'
      : settings.themeMode === 'high-contrast'
        ? 'highContrast'
        : settings.themeMode;

  return (
    <View style={styles.group}>
      <View
        style={styles.segmentRow}
        accessibilityRole="radiogroup"
        accessibilityLabel={t('accessibility.cognitive.presetGroup')}
        {...webRadioGroupProps}
      >
        {presetOptions.map((preset) => (
          <View key={preset.id} style={styles.optionWrapper}>
            <OptionButton
              value={preset.id}
              label={t(`cognitiveSettings.presets.items.${preset.id}.label`)}
              isActive={currentPreset === preset.id}
              onPress={() => applyPreset(preset.id)}
              icon={preset.icon}
              description={t(`cognitiveSettings.presets.items.${preset.id}.description`)}
            />
          </View>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{t('cognitiveSettings.summary.title')}</Text>
        <Text style={styles.summaryText}>
          {t('cognitiveSettings.summary.currentPreset')}:{' '}
          {currentPreset
            ? t(`cognitiveSettings.presets.items.${currentPreset}.label`)
            : t('cognitiveSettings.presets.custom')}
        </Text>
        <Text style={styles.summaryText}>
          {t('cognitiveSettings.summary.currentTheme')}: {t(`settings.theme.${themeLabelKey}`)}
        </Text>
      </View>
    </View>
  );
}
