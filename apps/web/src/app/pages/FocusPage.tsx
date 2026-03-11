import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useCognitivePreferences } from '../../cognitive';
import { PomodoroTimer } from '../components/PomodoroTimer';
<<<<<<< HEAD
import { TaskList } from '../components/modules/TaskList';
=======
import { FocusTaskList } from '../components/FocusTaskList';
>>>>>>> 7cbdb787403598b8db9cb620417019cdebcb6881
import { rem, extractPixels } from '../../utils';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: preferences.simpleInterface ? rem(space[3]) : rem(space[4]),
    },
    card: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: preferences.simpleInterface ? 0 : 0.1,
      shadowRadius: preferences.simpleInterface ? 0 : 8,
      elevation: preferences.simpleInterface ? 0 : 3,
      marginBottom: rem(space[6]),
    },
    title: {
      fontSize: rem(fontSizes['2xl']) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
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
    },
  });

export function FocusPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

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
          <FocusTaskList />
        </View>
      </View>
    </View>
  );
}
