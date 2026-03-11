import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels } from '../../../utils';

interface ProgressBarProps {
  progress: number; // 0-1
  height?: string;
  animated?: boolean;
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

export function ProgressBar({ progress, height = '8px' }: ProgressBarProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View style={[styles.container, { height: rem(height) }]}>
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
