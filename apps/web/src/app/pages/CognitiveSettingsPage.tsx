import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    card: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: rem(fontSizes['2xl']),
      fontWeight: fontWeights.bold,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    text: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * 1.5,
    },
  });

export function CognitiveSettingsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('pages.cognitive.title')}</Text>
      <Text style={styles.text}>{t('pages.cognitive.body')}</Text>
    </View>
  );
}
