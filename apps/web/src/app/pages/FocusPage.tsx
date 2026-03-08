import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { TaskList } from '../components/TaskList';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: rem(space[4]),
    },
    card: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: rem(space[6]),
    },
    title: {
      fontSize: rem(fontSizes['2xl']),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    text: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * 1.5,
    },
    contentRow: {
      flex: 1,
      flexDirection: 'row',
      gap: rem(space[6]),
      flexWrap: 'wrap',
    },
    timerColumn: {
      flex: 2,
      minWidth: 300,
    },
    taskColumn: {
      flex: 1,
      minWidth: 250,
    }
  });

export function FocusPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('pages.focus.title')}</Text>
        <Text style={styles.text}>{t('pages.focus.body')}</Text>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.timerColumn}>
          <PomodoroTimer />
        </View>
        <View style={styles.taskColumn}>
          <TaskList />
        </View>
      </View>
    </View>
  );
}
