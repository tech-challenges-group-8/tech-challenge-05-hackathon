import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { useCognitivePreferences, type CognitiveSettingsState } from '../../../cognitive';
import { OptionButton, ToggleRow } from '../ui';
import { useTheme, themes } from '../../../theme';
import type { Sensory, ThemeMode } from '../../../services';
import { rem } from '../../../utils';

interface SensorySettingsProps {
  readonly settings: CognitiveSettingsState;
  readonly isDesktop: boolean;
  readonly setTheme: (themeMode: ThemeMode) => void;
  readonly updateSensory: (sensory: Partial<Sensory>) => void;
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
    title: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    segmentRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: rem(space[2]),
    },
    optionWrapper: {
      width: isDesktop ? '23.5%' : '48%',
    },
  });

export function SensorySettings({ settings, isDesktop, setTheme, updateSensory }: SensorySettingsProps) {
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

  const themeOptions: { id: ThemeMode; label: string }[] = [
    { id: 'light', label: t('settings.theme.light') },
    { id: 'dark', label: t('settings.theme.dark') },
    { id: 'soft-pastel', label: t('settings.theme.softPastel') },
    { id: 'high-contrast', label: t('settings.theme.highContrast') },
  ];

  return (
    <View style={styles.group}>
      <View style={styles.group}>
        <Text style={styles.title}>{t('cognitiveSettings.sensory.theme.title')}</Text>
        <View
          style={styles.segmentRow}
          accessibilityRole="radiogroup"
          accessibilityLabel={t('accessibility.cognitive.themeGroup')}
          {...webRadioGroupProps}
        >
          {themeOptions.map((option) => (
            <View key={option.id} style={styles.optionWrapper}>
              <OptionButton
                value={option.id}
                label={option.label}
                isActive={settings.themeMode === option.id}
                onPress={() => setTheme(option.id)}
                previewColor={themes[option.id].colors.primary.DEFAULT}
              />
            </View>
          ))}
        </View>
      </View>

      <ToggleRow
        title={t('cognitiveSettings.sensory.muteSounds.title')}
        description={t('cognitiveSettings.sensory.muteSounds.description')}
        value={settings.sensory.muteSounds}
        onValueChange={(checked) => updateSensory({ muteSounds: checked })}
      />
      <ToggleRow
        title={t('cognitiveSettings.sensory.hideUrgencyIndicators.title')}
        description={t('cognitiveSettings.sensory.hideUrgencyIndicators.description')}
        value={settings.sensory.hideUrgencyIndicators}
        onValueChange={(checked) => updateSensory({ hideUrgencyIndicators: checked })}
      />
    </View>
  );
}
