import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useCognitivePreferences } from '../../cognitive';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResponseDashboardStatsDto } from '@mindease/dtos';
import { useAuth } from '../../auth';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    card: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      marginBottom: rem(space[4]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: preferences.simpleInterface ? 0 : 0.1,
      shadowRadius: preferences.simpleInterface ? 0 : 8,
      elevation: preferences.simpleInterface ? 0 : 3,
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
    statCard: {
      flex: 1,
      backgroundColor: preferences.hideUrgencyIndicators
        ? themeColors.card.DEFAULT
        : themeColors.accent.DEFAULT,
      borderRadius: parseInt(radii.md),
      padding: rem(space[4]),
      marginRight: rem(space[3]),
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    statCardLast: {
      marginRight: 0,
    },
    statLabel: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: preferences.hideUrgencyIndicators
        ? themeColors.muted.foreground
        : themeColors.accent.foreground,
      marginBottom: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    statValue: {
      fontSize: rem(fontSizes['3xl']) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: preferences.hideUrgencyIndicators
        ? themeColors.foreground
        : themeColors.accent.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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
  }, [fetchStats]);

  const formatFocusTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>{t('pages.dashboard.title')}</Text>
        {!preferences.simpleInterface && (
          <Text style={styles.subtitle}>{t('pages.dashboard.subtitle')}</Text>
        )}
        <Text style={styles.text}>{t('pages.dashboard.body')}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t('pages.dashboard.stats.activeTasks')}</Text>
            <Text style={styles.statValue}>{isLoading ? '...' : stats?.activeTasks ?? 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t('pages.dashboard.stats.completedToday')}</Text>
            <Text style={styles.statValue}>{isLoading ? '...' : stats?.completedToday ?? 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t('pages.dashboard.stats.totalCompleted')}</Text>
            <Text style={styles.statValue}>{isLoading ? '...' : stats?.totalCompleted ?? 0}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardLast]}>
            <Text style={styles.statLabel}>{t('pages.dashboard.stats.focusTime')}</Text>
            <Text style={styles.statValue}>{isLoading ? '...' : formatFocusTime(stats?.totalFocusTime ?? 0)}</Text>
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
