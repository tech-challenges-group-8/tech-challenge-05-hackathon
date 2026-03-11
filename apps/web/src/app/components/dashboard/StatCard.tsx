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
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    card: {
      flex: 1,
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
    label: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: preferences.hideUrgencyIndicators
        ? themeColors.muted.foreground
        : themeColors.accent.foreground,
      marginBottom: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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

export function StatCard({ label, value, isLast = false }: StatCardProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [theme.colors, preferences]);

  return (
    <View style={[styles.card, isLast && styles.cardLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
