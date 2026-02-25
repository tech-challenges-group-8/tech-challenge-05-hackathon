import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';

const rem = (value: string) => parseFloat(value) * 16;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card.DEFAULT,
    borderRadius: parseInt(radii.lg),
    padding: rem(space[6]),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: rem(fontSizes['2xl']),
    fontWeight: fontWeights.bold,
    color: colors.foreground,
    marginBottom: rem(space[2]),
  },
  text: {
    fontSize: rem(fontSizes.sm),
    color: colors.foreground,
    lineHeight: rem(fontSizes.sm) * 1.5,
  },
});

export function FocusPage() {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('pages.focus.title')}</Text>
      <Text style={styles.text}>{t('pages.focus.body')}</Text>
    </View>
  );
}
