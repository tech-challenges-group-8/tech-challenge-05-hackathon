import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { useCognitivePreferences, type CognitiveSettingsState } from '../../../cognitive';
import { OptionButton, ToggleRow } from '../ui';
import { useTheme } from '../../../theme';
import type { Typography } from '../../../services';
import { rem } from '../../../utils';

interface TypographySettingsProps {
  readonly settings: CognitiveSettingsState;
  readonly isDesktop: boolean;
  readonly updateTypography: (typography: Partial<Typography>) => void;
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
    optionWrapperHalf: {
      width: isDesktop ? '49%' : '48%',
    },
    optionWrapperThird: {
      width: isDesktop ? '32%' : '48%',
    },
  });

export function TypographySettings({ settings, isDesktop, updateTypography }: TypographySettingsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(
    () => createStyles(isDesktop, theme.colors, preferences),
    [isDesktop, theme.colors, preferences],
  );
  const reactId = useId();
  const fontFamilyTitleId = `typography-font-family-title-${reactId}`;
  const textSizeTitleId = `typography-text-size-title-${reactId}`;
  const lineHeightTitleId = `typography-line-height-title-${reactId}`;
  const webRadioGroupProps = (titleId: string): Record<string, unknown> =>
    Platform.OS === 'web'
      ? { role: 'radiogroup', 'aria-labelledby': titleId }
      : {};

  return (
    <View style={styles.group}>
      <View style={styles.group}>
        <Text style={styles.title} nativeID={fontFamilyTitleId}>{t('cognitiveSettings.typography.fontFamily.title')}</Text>
        <View
          style={styles.segmentRow}
          accessibilityRole="radiogroup"
          accessibilityLabel={t('accessibility.cognitive.fontFamilyGroup')}
          {...webRadioGroupProps(fontFamilyTitleId)}
        >
          <View style={styles.optionWrapperHalf}>
            <OptionButton
              value="system"
              label={t('cognitiveSettings.typography.fontFamily.system')}
              isActive={settings.typography.fontFamily === 'system'}
              onPress={() => updateTypography({ fontFamily: 'system' })}
            />
          </View>
          <View style={styles.optionWrapperHalf}>
            <OptionButton
              value="dyslexia-friendly"
              label={t('cognitiveSettings.typography.fontFamily.dyslexiaFriendly')}
              isActive={settings.typography.fontFamily === 'dyslexia-friendly'}
              onPress={() => updateTypography({ fontFamily: 'dyslexia-friendly' })}
            />
          </View>
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.title} nativeID={textSizeTitleId}>{t('cognitiveSettings.typography.textSize.title')}</Text>
        <View
          style={styles.segmentRow}
          accessibilityRole="radiogroup"
          accessibilityLabel={t('accessibility.cognitive.textSizeGroup')}
          {...webRadioGroupProps(textSizeTitleId)}
        >
          <View style={styles.optionWrapperThird}>
            <OptionButton
              value="normal"
              label={t('cognitiveSettings.typography.textSize.normal')}
              isActive={settings.typography.textSize === 'normal'}
              onPress={() => updateTypography({ textSize: 'normal' })}
            />
          </View>
          <View style={styles.optionWrapperThird}>
            <OptionButton
              value="large"
              label={t('cognitiveSettings.typography.textSize.large')}
              isActive={settings.typography.textSize === 'large'}
              onPress={() => updateTypography({ textSize: 'large' })}
            />
          </View>
          <View style={styles.optionWrapperThird}>
            <OptionButton
              value="extra-large"
              label={t('cognitiveSettings.typography.textSize.extraLarge')}
              isActive={settings.typography.textSize === 'extra-large'}
              onPress={() => updateTypography({ textSize: 'extra-large' })}
            />
          </View>
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.title} nativeID={lineHeightTitleId}>{t('cognitiveSettings.typography.lineHeight.title')}</Text>
        <View
          style={styles.segmentRow}
          accessibilityRole="radiogroup"
          accessibilityLabel={t('accessibility.cognitive.lineHeightGroup')}
          {...webRadioGroupProps(lineHeightTitleId)}
        >
          <View style={styles.optionWrapperThird}>
            <OptionButton
              value="normal"
              label={t('cognitiveSettings.typography.lineHeight.normal')}
              isActive={settings.typography.lineHeight === 'normal'}
              onPress={() => updateTypography({ lineHeight: 'normal' })}
            />
          </View>
          <View style={styles.optionWrapperThird}>
            <OptionButton
              value="relaxed"
              label={t('cognitiveSettings.typography.lineHeight.relaxed')}
              isActive={settings.typography.lineHeight === 'relaxed'}
              onPress={() => updateTypography({ lineHeight: 'relaxed' })}
            />
          </View>
          <View style={styles.optionWrapperThird}>
            <OptionButton
              value="loose"
              label={t('cognitiveSettings.typography.lineHeight.loose')}
              isActive={settings.typography.lineHeight === 'loose'}
              onPress={() => updateTypography({ lineHeight: 'loose' })}
            />
          </View>
        </View>
      </View>

      <ToggleRow
        title={t('cognitiveSettings.typography.letterSpacing.title')}
        description={t('cognitiveSettings.typography.letterSpacing.description')}
        value={settings.typography.letterSpacing === 'wide'}
        onValueChange={(checked) => updateTypography({ letterSpacing: checked ? 'wide' : 'normal' })}
      />
    </View>
  );
}
