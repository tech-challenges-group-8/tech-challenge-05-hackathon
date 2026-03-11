import { ResponseDashboardStatsDto } from '@mindease/dtos';
import { fontSizes, fontWeights, space, WEB_SIDEBAR_BREAKPOINT } from '@mindease/ui-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useAuth } from '../../auth';
import { useCognitivePreferences } from '../../cognitive';
import { api } from '../../services';
import { useTheme } from '../../theme';
import { fontWeight, rem } from '../../utils';
import { StatCard } from '../components/dashboard/StatCard';
import { Card } from '../components/ui';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
  stackStats: boolean,
) =>
  StyleSheet.create({
    cardSpacing: {
      marginBottom: rem(space[4]),
    },
    title: {
      fontSize: rem(fontSizes['2xl']) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.bold),
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
      flexDirection: stackStats ? 'column' : 'row',
      flexWrap: stackStats ? 'nowrap' : 'wrap',
      marginTop: rem(space[4]),
      gap: stackStats ? rem(space[3]) : 0,
    },
  });

export function DashboardPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const preferences = useCognitivePreferences();
  const { width } = useWindowDimensions();

  const [stats, setStats] = useState<ResponseDashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    Platform.OS === 'web' ? window.innerWidth : 0,
  );

  const stackStats = Platform.OS !== 'web' || width < 520;
  const styles = useMemo(
    () => createStyles(theme.colors, preferences, stackStats),
    [preferences, stackStats, theme.colors],
  );

  const fetchStats = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const response = await api.get<ResponseDashboardStatsDto>('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchStats();
    
    // Refresh stats when the window is focused (web hydration)
    if (Platform.OS === 'web') {
      const handleFocus = () => fetchStats();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [fetchStats]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallWebResolution = Platform.OS === 'web' && windowWidth < WEB_SIDEBAR_BREAKPOINT;
  const webDashboardLandmarkProps: Record<string, unknown> = Platform.OS === 'web'
    ? { role: 'region', 'aria-label': t('accessibility.dashboard.pageRegion') }
    : {};
  const webHeadingProps: Record<string, unknown> = Platform.OS === 'web'
    ? { role: 'heading', 'aria-level': 1 }
    : {};

  const formatFocusTime = (minutes: number) => {
    const roundedMinutes = Math.round(minutes * 100) / 100;
    if (roundedMinutes < 60) return `${roundedMinutes}m`;
    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = Math.round((roundedMinutes % 60) * 100) / 100;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <View accessibilityLabel={t('accessibility.dashboard.pageRegion')} {...webDashboardLandmarkProps}>
      <Card style={styles.cardSpacing}>
        <Text style={styles.title} accessibilityRole="header" {...webHeadingProps}>{t('pages.dashboard.title')}</Text>
        {!preferences.simpleInterface && (
          <Text style={styles.subtitle}>{t('pages.dashboard.subtitle')}</Text>
        )}
        <Text style={styles.text}>{t('pages.dashboard.body')}</Text>

        <View style={[styles.statsContainer, isSmallWebResolution && { flexDirection: 'column' }]}>
          <StatCard
            label={t('pages.dashboard.stats.activeTasks')}
            value={isLoading ? '...' : String(stats?.activeTasks ?? 0)}
            stacked={stackStats || isSmallWebResolution}
          />
          <StatCard
            label={t('pages.dashboard.stats.completedToday')}
            value={isLoading ? '...' : String(stats?.completedToday ?? 0)}
            stacked={stackStats || isSmallWebResolution}
          />
          <StatCard
            label={t('pages.dashboard.stats.totalCompleted')}
            value={isLoading ? '...' : String(stats?.totalCompleted ?? 0)}
            stacked={stackStats || isSmallWebResolution}
          />
          <StatCard
            label={t('pages.dashboard.stats.focusTime')}
            value={isLoading ? '...' : formatFocusTime(stats?.totalFocusTime ?? 0)}
            isLast
            stacked={stackStats || isSmallWebResolution}
          />
        </View>
      </Card>
    </View>
  );
}
