import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';

const rem = (value: string) => parseFloat(value) * 16;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card.DEFAULT,
    borderRadius: parseInt(radii.lg),
    padding: rem(space[6]),
    marginBottom: rem(space[4]),
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
  subtitle: {
    fontSize: rem(fontSizes.md),
    color: colors.muted.foreground,
    marginBottom: rem(space[4]),
  },
  text: {
    fontSize: rem(fontSizes.sm),
    color: colors.foreground,
    lineHeight: rem(fontSizes.sm) * 1.5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: rem(space[4]),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.accent.DEFAULT,
    borderRadius: parseInt(radii.md),
    padding: rem(space[4]),
    marginRight: rem(space[3]),
  },
  statCardLast: {
    marginRight: 0,
  },
  statLabel: {
    fontSize: rem(fontSizes.xs),
    color: colors.accent.foreground,
    marginBottom: rem(space[1]),
  },
  statValue: {
    fontSize: rem(fontSizes['3xl']),
    fontWeight: fontWeights.bold,
    color: colors.accent.foreground,
  },
});

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>{t('pages.dashboard.title')}</Text>
        <Text style={styles.subtitle}>{t('pages.dashboard.subtitle')}</Text>
        <Text style={styles.text}>{t('pages.dashboard.body')}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t('pages.dashboard.stats.activeTasks')}</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t('pages.dashboard.stats.completedToday')}</Text>
            <Text style={styles.statValue}>8</Text>
          </View>
          <View style={[styles.statCard, styles.statCardLast]}>
            <Text style={styles.statLabel}>{t('pages.dashboard.stats.focusTime')}</Text>
            <Text style={styles.statValue}>4h</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t('pages.dashboard.quickActionsTitle')}</Text>
        <Text style={styles.text}>{t('pages.dashboard.quickActionsBody')}</Text>
      </View>
    </View>
  );
}
