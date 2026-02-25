import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

// Helper to convert rem to pixels (assuming 16px base)
const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    header: {
      height: rem(space[16]),
      backgroundColor: themeColors.card.DEFAULT,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: rem(space[6]),
    },
    headerTitle: {
      fontSize: rem(fontSizes.xl),
      fontWeight: fontWeights.semiBold,
      color: themeColors.foreground,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      width: rem(space[10]),
      height: rem(space[10]),
      marginLeft: rem(space[3]),
      borderRadius: extractPixels(radii.full),
      backgroundColor: themeColors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerButtonIcon: {
      color: themeColors.primary.foreground,
    },
    headerButtonSecondary: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    headerButtonSecondaryIcon: {
      color: themeColors.secondary.foreground,
    },
  });

interface HeaderProps {
  title: string;
  onNewTask?: () => void;
  onProfile?: () => void;
}

export function Header({ title, onNewTask, onProfile }: HeaderProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onNewTask}
          accessibilityLabel={t('header.newTask')}
        >
          <Ionicons
            name="add"
            size={rem(fontSizes.lg)}
            style={styles.headerButtonIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.headerButtonSecondary]}
          onPress={onProfile}
          accessibilityLabel={t('header.profile')}
        >
          <Ionicons
            name="person-circle"
            size={rem(fontSizes.lg)}
            style={styles.headerButtonSecondaryIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
