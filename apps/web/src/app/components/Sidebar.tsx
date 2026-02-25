import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';

// Helper to convert rem to pixels (assuming 16px base)
const rem = (value: string) => parseFloat(value) * 16;

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: rem(space[4]),
  },
  sidebarHeader: {
    marginBottom: rem(space[6]),
  },
  logo: {
    fontSize: rem(fontSizes['2xl']),
    fontWeight: fontWeights.bold,
    color: colors.primary.DEFAULT,
    marginBottom: rem(space[2]),
  },
  logoSubtitle: {
    fontSize: rem(fontSizes.xs),
    color: colors.muted.foreground,
  },
  menuItem: {
    paddingVertical: rem(space[3]),
    paddingHorizontal: rem(space[4]),
    marginBottom: rem(space[1]),
    borderRadius: parseInt(radii.md),
  },
  menuItemActive: {
    backgroundColor: colors.cognitive.highlight,
  },
  menuItemText: {
    fontSize: rem(fontSizes.md),
    color: colors.foreground,
  },
  menuItemTextActive: {
    fontWeight: fontWeights.semiBold,
    color: colors.primary.DEFAULT,
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
