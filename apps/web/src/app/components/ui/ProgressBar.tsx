import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels } from '../../../utils';

interface ProgressBarProps {
  readonly progress: number; // 0-1
  readonly height?: string;
  readonly animated?: boolean;
  readonly accessibilityLabel?: string;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  _preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      height: rem(space[2]),
      backgroundColor: themeColors.muted.DEFAULT,
      borderRadius: extractPixels(radii.full),
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: themeColors.primary.DEFAULT,
      borderRadius: extractPixels(radii.full),
    },
  });

export function ProgressBar({ progress, height = space[2], accessibilityLabel }: ProgressBarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const currentPercent = Math.round(clampedProgress * 100);
  const resolvedHeight = height.endsWith('px') ? Number.parseFloat(height) : rem(height);
  const webProgressProps: Record<string, unknown> = Platform.OS === 'web'
    ? {
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': currentPercent,
    }
    : {};

  return (
    <View
      style={[styles.container, { height: resolvedHeight }]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? t('accessibility.components.progress')}
      accessibilityValue={{ min: 0, max: 100, now: currentPercent }}
      {...webProgressProps}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
          },
        ]}
      />
    </View>
  );
}
