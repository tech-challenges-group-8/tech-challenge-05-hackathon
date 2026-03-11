import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useCognitivePreferences } from '../../cognitive';
import { KanbanBoard } from '../components/modules/KanbanBoard';
import { rem, extractPixels, fontWeight } from '../../utils';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
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
    title: {
      fontSize: rem(fontSizes['2xl']),
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    text: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * 1.5,
    },
  });

export function KanbanPage() {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <View style={styles.card}>
      <KanbanBoard />
    </View>
  );
}
