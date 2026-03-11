import { View, Text, StyleSheet, Platform } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useCognitivePreferences } from '../../cognitive';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResponseDashboardStatsDto } from '@mindease/dtos';
import { useAuth } from '../../auth';
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
  const { currentUser } = useAuth();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  const [stats, setStats] = useState<ResponseDashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3001/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  const formatFocusTime = (minutes: number) => {
    const roundedMinutes = Math.round(minutes * 100) / 100;
    if (roundedMinutes < 60) return `${roundedMinutes}m`;
    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = Math.round((roundedMinutes % 60) * 100) / 100;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <View>
      <Card style={styles.cardSpacing}>
        <Text style={styles.title}>{t('pages.dashboard.title')}</Text>
        {!preferences.simpleInterface && (
          <Text style={styles.subtitle}>{t('pages.dashboard.subtitle')}</Text>
        )}
        <Text style={styles.text}>{t('pages.dashboard.body')}</Text>

        <View style={styles.statsContainer}>
          <StatCard label={t('pages.dashboard.stats.activeTasks')} value={isLoading ? '...' : stats?.activeTasks as any ?? 0} />
          <StatCard label={t('pages.dashboard.stats.completedToday')} value={isLoading ? '...' : stats?.completedToday as any ?? 0} />
          <StatCard label={t('pages.dashboard.stats.totalCompleted')} value={isLoading ? '...' : stats?.totalCompleted as any ?? 0} />
          <StatCard label={t('pages.dashboard.stats.focusTime')} value={isLoading ? '...' : formatFocusTime(stats?.totalFocusTime ?? 0)} isLast />
        </View>
      </Card>

      <Card>
        <Text style={styles.title}>{t('pages.dashboard.quickActionsTitle')}</Text>
        <Text style={styles.text}>{t('pages.dashboard.quickActionsBody')}</Text>
      </Card>
    </View>
  );
}
