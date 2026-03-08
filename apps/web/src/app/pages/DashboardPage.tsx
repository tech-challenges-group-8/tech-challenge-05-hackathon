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
      marginBottom: rem(space[4]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: rem(fontSizes['2xl']),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    subtitle: {
      fontSize: rem(fontSizes.md),
      color: themeColors.muted.foreground,
      marginBottom: rem(space[4]),
    },
    text: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * 1.5,
    },
    statsContainer: {
      flexDirection: 'row',
      marginTop: rem(space[4]),
    },
    statCard: {
      flex: 1,
      backgroundColor: themeColors.accent.DEFAULT,
      borderRadius: parseInt(radii.md),
      padding: rem(space[4]),
      marginRight: rem(space[3]),
    },
    statCardLast: {
      marginRight: 0,
    },
    statLabel: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.accent.foreground,
      marginBottom: rem(space[1]),
    },
    statValue: {
      fontSize: rem(fontSizes['3xl']),
      fontWeight: fontWeights.bold as any,
      color: themeColors.accent.foreground,
    },
  });

export function DashboardPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

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
