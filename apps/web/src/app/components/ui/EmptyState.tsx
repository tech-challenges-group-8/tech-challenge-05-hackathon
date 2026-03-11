import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizes, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, fontWeight } from '../../../utils';

interface EmptyStateProps {
  readonly icon?: keyof typeof Ionicons.glyphMap;
  readonly iconSize?: number;
  readonly title: string;
  readonly subtitle?: string;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: rem(space[8]),
      paddingHorizontal: rem(space[4]),
    },
    icon: {
      marginBottom: rem(space[3]),
    },
    title: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeight('600'),
      color: themeColors.foreground,
      textAlign: 'center',
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      marginBottom: rem(space[2]),
    },
    subtitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      textAlign: 'center',
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function EmptyState({ icon = 'document-outline', iconSize = 48, title, subtitle }: EmptyStateProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          name={icon}
          size={iconSize}
          color={theme.colors.muted.foreground}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}
