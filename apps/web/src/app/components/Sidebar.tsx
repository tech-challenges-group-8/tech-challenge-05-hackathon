import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';

// Helper to convert rem to pixels (assuming 16px base)
const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
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
      fontSize: rem(fontSizes['2xl']),
      fontWeight: fontWeights.bold,
      color: themeColors.primary.DEFAULT,
      marginBottom: rem(space[2]),
    },
    logoSubtitle: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
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
      fontSize: rem(fontSizes.md),
      color: themeColors.foreground,
    },
    menuItemTextActive: {
      fontWeight: fontWeights.semiBold,
      color: themeColors.primary.DEFAULT,
    },
  });

const menuItems = [
  { id: 'dashboard', labelKey: 'menu.dashboard', icon: '📊' },
  { id: 'tasks', labelKey: 'menu.tasks', icon: '✓' },
  { id: 'focus', labelKey: 'menu.focus', icon: '🎯' },
  { id: 'settings', labelKey: 'menu.settings', icon: '⚙️' },
];

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menuId: string) => void;
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.logo}>{t('app.name')}</Text>
        <Text style={styles.logoSubtitle}>{t('app.tagline')}</Text>
      </View>
      
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.menuItem,
            activeMenu === item.id && styles.menuItemActive,
          ]}
          onPress={() => onMenuChange(item.id)}
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
