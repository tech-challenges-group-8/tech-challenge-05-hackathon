import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../cognitive';
import { useTheme } from '../../theme';
import { rem } from '../../utils';
import { BOTTOM_TABS, type BottomTab } from '../navigation.config';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: themeColors.card.DEFAULT,
    },
    container: {
      height: 64,
      backgroundColor: themeColors.card.DEFAULT,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: rem(space[4]),
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: rem(space[2]),
      paddingHorizontal: rem(space[3]),
      borderRadius: 8,
      gap: rem(space[1]),
    },
    tabItemActive: {
      backgroundColor: themeColors.cognitive.highlight,
    },
    icon: {
      fontSize: rem(space[4]),
      color: themeColors.foreground,
    },
    iconActive: {
      color: themeColors.primary.DEFAULT,
    },
    label: {
      fontSize: rem(space[2]),
      color: themeColors.muted.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    labelActive: {
      color: themeColors.primary.DEFAULT,
      fontWeight: '600' as any,
    },
  });

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {BOTTOM_TABS.map((tab: BottomTab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
            onPress={() => onTabChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}
            accessibilityLabel={tab.label || tab.id}
          >
            <Text style={[styles.icon, activeTab === tab.id && styles.iconActive]}>
              {tab.icon}
            </Text>
            {tab.label && (
              <Text style={[styles.label, activeTab === tab.id && styles.labelActive]}>
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
