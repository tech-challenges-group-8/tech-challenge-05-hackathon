import { Text, View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels, fontWeight } from '../../../utils';

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLast?: boolean;
  readonly stacked?: boolean;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    card: {
      flex: 1,
      minWidth: 0,
      backgroundColor: preferences.hideUrgencyIndicators
        ? themeColors.card.DEFAULT
        : themeColors.accent.DEFAULT,
      borderRadius: extractPixels(radii.md),
      padding: rem(space[4]),
      marginRight: rem(space[3]),
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    cardLast: {
      marginRight: 0,
    },
    cardStacked: {
      marginRight: 0,
      marginBottom: rem(space[3]),
    },
    cardStackedLast: {
      marginBottom: 0,
    },
    label: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: preferences.hideUrgencyIndicators
        ? themeColors.muted.foreground
        : themeColors.accent.foreground,
      marginBottom: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
    },
    value: {
      fontSize: rem(fontSizes['3xl']) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.bold),
      color: preferences.hideUrgencyIndicators
        ? themeColors.foreground
        : themeColors.accent.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function StatCard({ label, value, isLast = false, stacked = false }: StatCardProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [theme.colors, preferences]);
  const combinedLabel = `${label}: ${value}`;

  return (
    <View
      style={[
        styles.card,
        isLast && styles.cardLast,
        stacked && styles.cardStacked,
        stacked && isLast && styles.cardStackedLast,
      ]}
      accessible
      accessibilityLabel={combinedLabel}
    >
      <Text style={styles.label} accessible={false}>{label}</Text>
      <Text style={styles.value} accessible={false}>{value}</Text>
    </View>
  );
}
