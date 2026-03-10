import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import {
  useCognitivePreferences,
  useCognitiveSettings,
  type CognitivePreset,
} from '../../cognitive';
import { useTheme, themes } from '../../theme';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  isDesktop: boolean,
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    card: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: preferences.simpleInterface ? 0 : 0.1,
      shadowRadius: preferences.simpleInterface ? 0 : 8,
      elevation: preferences.simpleInterface ? 0 : 3,
    },
    headerRow: {
      flexDirection: isDesktop ? 'row' : 'column',
      justifyContent: 'space-between',
      gap: rem(space[4]),
      marginBottom: rem(space[6]),
    },
    headerCopy: {
      flex: 1,
      gap: rem(space[2]),
    },
    title: {
      fontSize: rem(fontSizes['2xl']) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    subtitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    headerActions: {
      flexDirection: isDesktop ? 'row' : 'column',
      gap: rem(space[3]),
      alignItems: isDesktop ? 'center' : 'stretch',
    },
    statusPill: {
      borderRadius: extractPixels(radii.full),
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[2]),
      backgroundColor: themeColors.accent.DEFAULT,
      alignSelf: isDesktop ? 'center' : 'flex-start',
    },
    statusText: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.accent.foreground,
      fontWeight: fontWeights.semiBold as any,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    button: {
      backgroundColor: themeColors.primary.DEFAULT,
      borderRadius: extractPixels(radii.md),
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: rem(space[2]),
    },
    buttonSecondary: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    buttonText: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.primary.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    buttonTextSecondary: {
      color: themeColors.secondary.foreground,
    },
    errorBanner: {
      backgroundColor: themeColors.secondary.DEFAULT,
      borderRadius: extractPixels(radii.md),
      borderWidth: 1,
      borderColor: themeColors.border,
      padding: rem(space[4]),
      marginBottom: rem(space[4]),
    },
    errorText: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    sections: {
      flexDirection: isDesktop ? 'row' : 'column',
      flexWrap: 'wrap',
      gap: rem(space[4]),
    },
    sectionCard: {
      width: isDesktop ? '48.5%' : '100%',
      backgroundColor: themeColors.background,
      borderRadius: extractPixels(radii.lg),
      borderWidth: 1,
      borderColor: themeColors.border,
      padding: rem(space[4]),
      gap: rem(space[4]),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: rem(space[3]),
    },
    sectionHeaderCopy: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[3]),
      flex: 1,
    },
    sectionTitle: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    sectionDescription: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    controlGroup: {
      gap: rem(space[3]),
    },
    segmentRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: rem(space[2]),
    },
    optionButton: {
      minWidth: isDesktop ? '22%' : '47%',
      borderRadius: extractPixels(radii.md),
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card.DEFAULT,
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[3]),
      alignItems: 'center',
      justifyContent: 'center',
      gap: rem(space[2]),
    },
    optionButtonActive: {
      borderColor: themeColors.primary.DEFAULT,
      backgroundColor: themeColors.cognitive.highlight,
    },
    optionLabel: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeights.medium as any,
      color: themeColors.foreground,
      textAlign: 'center',
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    optionLabelActive: {
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeights.bold as any,
    },
    themePreview: {
      width: '100%',
      height: rem(space[4]),
      borderRadius: extractPixels(radii.sm),
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: rem(space[3]),
    },
    toggleCopy: {
      flex: 1,
      gap: 2,
    },
    toggleTitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    toggleDescription: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      lineHeight: rem(fontSizes.xs) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    summaryCard: {
      borderRadius: extractPixels(radii.md),
      backgroundColor: themeColors.card.DEFAULT,
      padding: rem(space[4]),
      gap: rem(space[2]),
    },
    summaryTitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
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

export function CognitiveSettingsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    settings,
    currentPreset,
    isLoading,
    isSaving,
    error,
    refresh,
    updateTypography,
    updateFocusMode,
    updateSensory,
    setTheme,
    applyPreset,
    resetToDefault,
  } = useCognitiveSettings();
  const preferences = useCognitivePreferences();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 960;
  const styles = useMemo(
    () => createStyles(theme.colors, isDesktop, preferences),
    [isDesktop, preferences, theme.colors],
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    reading: true,
    focus: false,
    sensory: false,
    emotion: false,
  });

  const presetOptions: Array<{ id: CognitivePreset; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'default', icon: 'sparkles-outline' },
    { id: 'reading', icon: 'book-outline' },
    { id: 'focus', icon: 'eye-outline' },
    { id: 'sensory', icon: 'color-palette-outline' },
    { id: 'emotion', icon: 'heart-outline' },
  ];

  const themeOptions = [
    { id: 'light', label: t('settings.theme.light') },
    { id: 'dark', label: t('settings.theme.dark') },
    { id: 'soft-pastel', label: t('settings.theme.softPastel') },
    { id: 'high-contrast', label: t('settings.theme.highContrast') },
  ] as const;

  const statusLabel = isLoading
    ? t('cognitiveSettings.status.loading')
    : isSaving
      ? t('cognitiveSettings.status.saving')
      : t('cognitiveSettings.status.saved');

  const themeLabelKey =
    settings.themeMode === 'soft-pastel'
      ? 'softPastel'
      : settings.themeMode === 'high-contrast'
        ? 'highContrast'
        : settings.themeMode;

  const toggleSection = (sectionId: string) => {
    setExpandedSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }));
  };

  const renderOptionButton = (
    value: string,
    label: string,
    isActive: boolean,
    onPress: () => void,
    previewColor?: string,
    icon?: keyof typeof Ionicons.glyphMap,
    description?: string,
  ) => (
    <TouchableOpacity
      key={value}
      style={[styles.optionButton, isActive && styles.optionButtonActive]}
      onPress={onPress}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={isActive ? theme.colors.primary.DEFAULT : theme.colors.foreground}
        />
      ) : null}
      <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>{label}</Text>
      {description ? <Text style={styles.summaryText}>{description}</Text> : null}
      {previewColor ? <View style={[styles.themePreview, { backgroundColor: previewColor }]} /> : null}
    </TouchableOpacity>
  );

  const renderToggle = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (checked: boolean) => void,
  ) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.muted.DEFAULT, true: theme.colors.primary.DEFAULT }}
        thumbColor={theme.colors.card.DEFAULT}
      />
    </View>
  );

  const sections = {
    reading: (
      <View style={styles.controlGroup}>
        <View style={styles.controlGroup}>
          <Text style={styles.summaryTitle}>{t('cognitiveSettings.typography.fontFamily.title')}</Text>
          <View style={styles.segmentRow}>
            {renderOptionButton(
              'system',
              t('cognitiveSettings.typography.fontFamily.system'),
              settings.typography.fontFamily === 'system',
              () => updateTypography({ fontFamily: 'system' }),
            )}
            {renderOptionButton(
              'dyslexia-friendly',
              t('cognitiveSettings.typography.fontFamily.dyslexiaFriendly'),
              settings.typography.fontFamily === 'dyslexia-friendly',
              () => updateTypography({ fontFamily: 'dyslexia-friendly' }),
            )}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.summaryTitle}>{t('cognitiveSettings.typography.textSize.title')}</Text>
          <View style={styles.segmentRow}>
            {renderOptionButton(
              'normal',
              t('cognitiveSettings.typography.textSize.normal'),
              settings.typography.textSize === 'normal',
              () => updateTypography({ textSize: 'normal' }),
            )}
            {renderOptionButton(
              'large',
              t('cognitiveSettings.typography.textSize.large'),
              settings.typography.textSize === 'large',
              () => updateTypography({ textSize: 'large' }),
            )}
            {renderOptionButton(
              'extra-large',
              t('cognitiveSettings.typography.textSize.extraLarge'),
              settings.typography.textSize === 'extra-large',
              () => updateTypography({ textSize: 'extra-large' }),
            )}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.summaryTitle}>{t('cognitiveSettings.typography.lineHeight.title')}</Text>
          <View style={styles.segmentRow}>
            {renderOptionButton(
              'normal',
              t('cognitiveSettings.typography.lineHeight.normal'),
              settings.typography.lineHeight === 'normal',
              () => updateTypography({ lineHeight: 'normal' }),
            )}
            {renderOptionButton(
              'relaxed',
              t('cognitiveSettings.typography.lineHeight.relaxed'),
              settings.typography.lineHeight === 'relaxed',
              () => updateTypography({ lineHeight: 'relaxed' }),
            )}
            {renderOptionButton(
              'loose',
              t('cognitiveSettings.typography.lineHeight.loose'),
              settings.typography.lineHeight === 'loose',
              () => updateTypography({ lineHeight: 'loose' }),
            )}
          </View>
        </View>

        {renderToggle(
          t('cognitiveSettings.typography.letterSpacing.title'),
          t('cognitiveSettings.typography.letterSpacing.description'),
          settings.typography.letterSpacing === 'wide',
          (checked) => updateTypography({ letterSpacing: checked ? 'wide' : 'normal' }),
        )}
      </View>
    ),
    focus: (
      <View style={styles.controlGroup}>
        {renderToggle(
          t('cognitiveSettings.focus.hideSidebar.title'),
          t('cognitiveSettings.focus.hideSidebar.description'),
          settings.focusMode.hideSidebar,
          (checked) => updateFocusMode({ hideSidebar: checked }),
        )}
        {renderToggle(
          t('cognitiveSettings.focus.highlightActiveTask.title'),
          t('cognitiveSettings.focus.highlightActiveTask.description'),
          settings.focusMode.highlightActiveTask,
          (checked) => updateFocusMode({ highlightActiveTask: checked }),
        )}
        {renderToggle(
          t('cognitiveSettings.focus.animationsEnabled.title'),
          t('cognitiveSettings.focus.animationsEnabled.description'),
          settings.focusMode.animationsEnabled,
          (checked) => updateFocusMode({ animationsEnabled: checked }),
        )}
        {renderToggle(
          t('cognitiveSettings.focus.simpleInterface.title'),
          t('cognitiveSettings.focus.simpleInterface.description'),
          settings.focusMode.simpleInterface,
          (checked) => updateFocusMode({ simpleInterface: checked }),
        )}
      </View>
    ),
    sensory: (
      <View style={styles.controlGroup}>
        <View style={styles.controlGroup}>
          <Text style={styles.summaryTitle}>{t('cognitiveSettings.sensory.theme.title')}</Text>
          <View style={styles.segmentRow}>
            {themeOptions.map((option) =>
              renderOptionButton(
                option.id,
                option.label,
                settings.themeMode === option.id,
                () => setTheme(option.id),
                themes[option.id].colors.primary.DEFAULT,
              ),
            )}
          </View>
        </View>
        {renderToggle(
          t('cognitiveSettings.sensory.muteSounds.title'),
          t('cognitiveSettings.sensory.muteSounds.description'),
          settings.sensory.muteSounds,
          (checked) => updateSensory({ muteSounds: checked }),
        )}
        {renderToggle(
          t('cognitiveSettings.sensory.hideUrgencyIndicators.title'),
          t('cognitiveSettings.sensory.hideUrgencyIndicators.description'),
          settings.sensory.hideUrgencyIndicators,
          (checked) => updateSensory({ hideUrgencyIndicators: checked }),
        )}
      </View>
    ),
    emotion: (
      <View style={styles.controlGroup}>
        <View style={styles.segmentRow}>
          {presetOptions.map((preset) =>
            renderOptionButton(
              preset.id,
              t(`cognitiveSettings.presets.items.${preset.id}.label`),
              currentPreset === preset.id,
              () => applyPreset(preset.id),
              undefined,
              preset.icon,
              t(`cognitiveSettings.presets.items.${preset.id}.description`),
            ),
          )}
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
    ),
  };

  const renderSection = (
    key: keyof typeof sections,
    title: string,
    description: string,
    icon: keyof typeof Ionicons.glyphMap,
  ) => {
    if (isDesktop) {
      return (
        <View key={key} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Ionicons name={icon} size={20} color={theme.colors.primary.DEFAULT} />
              <View>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.sectionDescription}>{description}</Text>
              </View>
            </View>
          </View>
          {sections[key]}
        </View>
      );
    }

    return (
      <View key={key} style={styles.sectionCard}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(key)}>
          <View style={styles.sectionHeaderCopy}>
            <Ionicons name={icon} size={20} color={theme.colors.primary.DEFAULT} />
            <View>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionDescription}>{description}</Text>
            </View>
          </View>
          <Ionicons
            name={expandedSections[key] ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={theme.colors.muted.foreground}
          />
        </TouchableOpacity>
        {expandedSections[key] ? sections[key] : null}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{t('pages.cognitive.title')}</Text>
          <Text style={styles.subtitle}>{t('cognitiveSettings.description')}</Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={refresh}>
            <Ionicons name="refresh-outline" size={16} color={theme.colors.secondary.foreground} />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              {t('cognitiveSettings.actions.retry')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetToDefault}>
            <Ionicons name="reload-outline" size={16} color={theme.colors.primary.foreground} />
            <Text style={styles.buttonText}>{t('cognitiveSettings.actions.reset')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{t('cognitiveSettings.status.error', { message: error })}</Text>
        </View>
      ) : null}

      <View style={styles.sections}>
        {renderSection(
          'reading',
          t('cognitiveSettings.sections.reading.title'),
          t('cognitiveSettings.sections.reading.description'),
          'book-outline',
        )}
        {renderSection(
          'focus',
          t('cognitiveSettings.sections.focus.title'),
          t('cognitiveSettings.sections.focus.description'),
          'eye-outline',
        )}
        {renderSection(
          'sensory',
          t('cognitiveSettings.sections.sensory.title'),
          t('cognitiveSettings.sections.sensory.description'),
          'color-palette-outline',
        )}
        {renderSection(
          'emotion',
          t('cognitiveSettings.sections.emotion.title'),
          t('cognitiveSettings.sections.emotion.description'),
          'heart-outline',
        )}
      </View>
    </View>
  );
}
