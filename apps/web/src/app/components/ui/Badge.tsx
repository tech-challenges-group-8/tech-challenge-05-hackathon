import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizes, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels, fontWeight } from '../../../utils';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'warning';

interface BadgeProps {
  readonly label: string;
  readonly variant?: BadgeVariant;
  readonly size?: 'sm' | 'md' | 'lg';
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) => {
  const baseStyles = StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[1]),
      borderRadius: extractPixels(radii.full),
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      fontWeight: fontWeight('600'),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

  const variants: Record<BadgeVariant, any> = {
    primary: {
      backgroundColor: themeColors.primary.DEFAULT,
      text: { color: themeColors.primary.foreground },
    },
    secondary: {
      backgroundColor: themeColors.secondary.DEFAULT,
      text: { color: themeColors.secondary.foreground },
    },
    accent: {
      backgroundColor: themeColors.accent.DEFAULT,
      text: { color: themeColors.accent.foreground },
    },
    danger: {
      backgroundColor: themeColors.destructive.DEFAULT,
      text: { color: themeColors.destructive.foreground },
    },
    success: {
      backgroundColor: '#22c55e',
      text: { color: '#ffffff' },
    },
    warning: {
      backgroundColor: '#f97316',
      text: { color: '#ffffff' },
    },
  };

  return { ...baseStyles, variants };
};

export function Badge({ label, variant = 'primary', size = 'md' }: BadgeProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  const variantStyle = styles.variants[variant];
  const sizeMultiplier = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;

  return (
    <View style={[styles.container, variantStyle, { paddingHorizontal: rem(space[3]) * sizeMultiplier }]}>
      <Text style={[styles.text, variantStyle.text]}>{label}</Text>
    </View>
  );
}
