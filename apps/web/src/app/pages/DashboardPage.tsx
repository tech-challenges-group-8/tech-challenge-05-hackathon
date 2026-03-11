import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useCognitivePreferences } from '../../cognitive';
import { rem } from '../../utils';
import { Card } from '../components/ui';
import { StatCard } from '../components/dashboard/StatCard';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    cardSpacing: {
      marginBottom: rem(space[4]),
    },
    title: {
      fontSize: rem(fontSizes['2xl']) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    subtitle: {
      fontSize: rem(fontSizes.md) * preferences.fontScale,
      color: themeColors.muted.foreground,
      marginBottom: rem(space[4]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    text: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    statsContainer: {
      flexDirection: 'row',
      marginTop: rem(space[4]),
    },
  });

export function DashboardPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <View>
      <Card style={styles.cardSpacing}>
        <Text style={styles.title}>{t('pages.dashboard.title')}</Text>
        {!preferences.simpleInterface && (
          <Text style={styles.subtitle}>{t('pages.dashboard.subtitle')}</Text>
        )}
        <Text style={styles.text}>{t('pages.dashboard.body')}</Text>

        <View style={styles.statsContainer}>
          <StatCard label={t('pages.dashboard.stats.activeTasks')} value="12" />
          <StatCard label={t('pages.dashboard.stats.completedToday')} value="8" />
          <StatCard label={t('pages.dashboard.stats.focusTime')} value="4h" isLast />
        </View>
      </Card>

      <Card>
        <Text style={styles.title}>{t('pages.dashboard.quickActionsTitle')}</Text>
        <Text style={styles.text}>{t('pages.dashboard.quickActionsBody')}</Text>
      </Card>
    </View>
  );
}
