import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useCognitivePreferences } from '../../cognitive';
import { rem, extractPixels, fontWeight } from '../../utils';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    sidebar: {
      width: 250,
      backgroundColor: themeColors.card.DEFAULT,
      borderRightWidth: 1,
      borderRightColor: themeColors.border,
      padding: rem(space[4]),
    },
    sidebarHeader: {
      marginBottom: rem(space[6]),
    },
    logo: {
      fontSize: rem(fontSizes['2xl']) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.primary.DEFAULT,
      marginBottom: rem(space[2]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    logoSubtitle: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    menuItem: {
      paddingVertical: rem(space[3]),
      paddingHorizontal: rem(space[4]),
      marginBottom: rem(space[1]),
      borderRadius: extractPixels(radii.md),
    },
    menuItemActive: {
      backgroundColor: themeColors.cognitive.highlight,
    },
    menuItemText: {
      fontSize: rem(fontSizes.md) * preferences.fontScale,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    menuItemTextActive: {
      fontWeight: fontWeight(fontWeights.semiBold),
      color: themeColors.primary.DEFAULT,
    },
  });

const menuItems = [
  { id: 'dashboard', labelKey: 'menu.dashboard', icon: '📊' },
  { id: 'tasks', labelKey: 'menu.tasks', icon: '✓' },
  { id: 'kanban', labelKey: 'menu.kanban', icon: '📋' },
  { id: 'focus', labelKey: 'menu.focus', icon: '🎯' },
  { id: 'cognitive', labelKey: 'menu.cognitive', icon: '🧠' },
];

interface SidebarProps {
  readonly activeMenu: string;
  readonly onMenuChange: (menuId: string) => void;
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.logo}>{t('app.name')}</Text>
        {!preferences.simpleInterface && (
          <Text style={styles.logoSubtitle}>{t('app.tagline')}</Text>
        )}
      </View>
      
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.menuItem,
            activeMenu === item.id && styles.menuItemActive,
          ]}
          onPress={() => onMenuChange(item.id)}
          accessibilityRole="button"
          accessibilityLabel={t(item.labelKey)}
        >
          <Text
            style={[
              styles.menuItemText,
              activeMenu === item.id && styles.menuItemTextActive,
            ]}
          >
            {item.icon}  {t(item.labelKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
