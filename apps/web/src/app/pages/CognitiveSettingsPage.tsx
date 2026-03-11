import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import {
  useCognitivePreferences,
  useCognitiveSettings,
} from '../../cognitive';
import { useTheme } from '../../theme';
import {
  CognitiveSection,
  FocusModeSettings,
  PresetSelector,
  SensorySettings,
  TypographySettings,
} from '../components/cognitive';
import { AppButton, Card } from '../components/ui';
<<<<<<< HEAD
import { rem, extractPixels } from '../../utils';
=======
import { rem, extractPixels, fontWeight } from '../../utils';
>>>>>>> 6022489e7174664b5db61d44421d43d8d45fdcfa

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  isTwoColumnLayout: boolean,
  isWideHeaderLayout: boolean,
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    pageCard: {
      padding: rem(isWideHeaderLayout ? space[6] : space[4]),
    },
    headerRow: {
      flexDirection: isWideHeaderLayout ? 'row' : 'column',
      justifyContent: 'space-between',
      gap: rem(space[4]),
      marginBottom: rem(space[6]),
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
      gap: rem(space[2]),
    },
    title: {
      fontSize: rem((isWideHeaderLayout ? fontSizes['2xl'] : fontSizes.xl)) * preferences.fontScale,
<<<<<<< HEAD
      fontWeight: fontWeights.bold as any,
=======
      fontWeight: fontWeight(fontWeights.bold),
>>>>>>> 6022489e7174664b5db61d44421d43d8d45fdcfa
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
    },
    subtitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
    },
    headerActions: {
      flexDirection: 'column',
      gap: rem(space[3]),
      alignItems: 'stretch',
      width: isWideHeaderLayout ? 320 : '100%',
      maxWidth: '100%',
    },
    statusPill: {
      borderRadius: extractPixels(radii.full),
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[2]),
      backgroundColor: themeColors.accent.DEFAULT,
      alignSelf: 'flex-start',
      maxWidth: '100%',
    },
    statusText: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.accent.foreground,
      fontWeight: fontWeight(fontWeights.semiBold),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    actionButton: {
      marginTop: 0,
      width: '100%',
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
      flexDirection: isTwoColumnLayout ? 'row' : 'column',
      flexWrap: 'wrap',
      gap: rem(space[4]),
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
  const isWideHeaderLayout = Platform.OS === 'web' && width >= 1380;
  const isTwoColumnLayout = Platform.OS === 'web' && width >= 1200;
  const styles = useMemo(
    () => createStyles(theme.colors, isTwoColumnLayout, isWideHeaderLayout, preferences),
    [isTwoColumnLayout, isWideHeaderLayout, preferences, theme.colors],
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    reading: true,
    focus: false,
    sensory: false,
    emotion: false,
  });

  const statusLabel = isLoading
    ? t('cognitiveSettings.status.loading')
    : isSaving
      ? t('cognitiveSettings.status.saving')
      : t('cognitiveSettings.status.saved');

  const toggleSection = (sectionId: string) => {
    setExpandedSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }));
  };

  const sections: {
    key: 'reading' | 'focus' | 'sensory' | 'emotion';
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    content: React.ReactNode;
  }[] = [
    {
      key: 'reading',
      title: t('cognitiveSettings.sections.reading.title'),
      description: t('cognitiveSettings.sections.reading.description'),
      icon: 'book-outline',
      content: (
        <TypographySettings
          settings={settings}
          isDesktop={isTwoColumnLayout}
          updateTypography={updateTypography}
        />
      ),
    },
    {
      key: 'focus',
      title: t('cognitiveSettings.sections.focus.title'),
      description: t('cognitiveSettings.sections.focus.description'),
      icon: 'eye-outline',
      content: <FocusModeSettings settings={settings} updateFocusMode={updateFocusMode} />,
    },
    {
      key: 'sensory',
      title: t('cognitiveSettings.sections.sensory.title'),
      description: t('cognitiveSettings.sections.sensory.description'),
      icon: 'color-palette-outline',
      content: (
        <SensorySettings
          settings={settings}
          isDesktop={isTwoColumnLayout}
          setTheme={setTheme}
          updateSensory={updateSensory}
        />
      ),
    },
    {
      key: 'emotion',
      title: t('cognitiveSettings.sections.emotion.title'),
      description: t('cognitiveSettings.sections.emotion.description'),
      icon: 'heart-outline',
      content: (
        <PresetSelector
          currentPreset={currentPreset}
          settings={settings}
          isDesktop={isTwoColumnLayout}
          applyPreset={applyPreset}
        />
      ),
    },
  ];

  return (
    <Card style={styles.pageCard}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{t('pages.cognitive.title')}</Text>
          <Text style={styles.subtitle}>{t('cognitiveSettings.description')}</Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
          <AppButton
            variant="secondary"
            style={styles.actionButton}
            onPress={() => {
              void refresh();
            }}
            icon={<Ionicons name="refresh-outline" size={16} color={theme.colors.secondary.foreground} />}
          >
            {t('cognitiveSettings.actions.retry')}
          </AppButton>
          <AppButton
            style={styles.actionButton}
            onPress={resetToDefault}
            icon={<Ionicons name="reload-outline" size={16} color={theme.colors.primary.foreground} />}
          >
            {t('cognitiveSettings.actions.reset')}
          </AppButton>
        </View>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{t('cognitiveSettings.status.error', { message: error })}</Text>
        </View>
      ) : null}

      <View style={styles.sections}>
        {sections.map((section) => (
          <CognitiveSection
            key={section.key}
            title={section.title}
            description={section.description}
            icon={section.icon}
            isDesktop={isTwoColumnLayout}
            expanded={expandedSections[section.key]}
            onToggle={() => toggleSection(section.key)}
          >
            {section.content}
          </CognitiveSection>
        ))}
      </View>
    </Card>
  );
}
