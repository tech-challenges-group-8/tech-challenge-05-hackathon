import { useMemo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { fontSizes, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels } from '../../../utils';

interface ToggleRowProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      gap: rem(space[3]),
    },
    content: {
      flex: 1,
      gap: rem(space[1]),
    },
    title: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: '600' as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    description: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      lineHeight: rem(fontSizes.xs) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function ToggleRow({ title, description, value, onValueChange }: ToggleRowProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.muted.DEFAULT, true: theme.colors.primary.DEFAULT }}
        thumbColor={theme.colors.card.DEFAULT}
      />
    </View>
  );
}
