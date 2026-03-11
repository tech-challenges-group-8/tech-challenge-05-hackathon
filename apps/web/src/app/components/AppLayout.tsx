import { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../cognitive';
import { useTheme } from '../../theme';
import { rem } from '../../utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomTabBar } from './BottomTabBar';

interface AppLayoutProps {
  readonly activeMenu: string;
  readonly onMenuChange: (menuId: string) => void;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly floatingElement?: React.ReactNode;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  simpleInterface: boolean,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: Platform.OS === 'web' ? 'row' : 'column',
      backgroundColor: themeColors.background,
    },
    mainContent: {
      flex: 1,
      flexDirection: 'column',
    },
    content: {
      flex: 1,
      padding: simpleInterface ? rem(space[4]) : rem(space[6]),
    },
  });

/**
 * AppLayout component handles the overall app structure.
 * Manages sidebar, header, content area, and bottom tab bar.
 */
export function AppLayout({
  activeMenu,
  onMenuChange,
  title,
  children,
  floatingElement,
}: AppLayoutProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const preferences = useCognitivePreferences();
  const styles = useMemo(
    () => createStyles(theme.colors, preferences.simpleInterface),
    [preferences.simpleInterface, theme.colors],
  );

  const showSidebar = Platform.OS === 'web' && !preferences.hideSidebar;
  const showBottomTabs = Platform.OS !== 'web';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {Platform.OS === 'web' && (
        <TouchableOpacity
          onPress={() => {
            const mainContent = document.getElementById('main-content');
            mainContent?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            mainContent?.focus();
          }}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.layout.skipToContent')}
        >
          <View style={{ position: 'absolute', left: 8, top: 8, zIndex: 1000, padding: 8 }}>
            <Text>{t('accessibility.layout.skipToContent')}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Sidebar for desktop */}
      {showSidebar && (
        <Sidebar activeMenu={activeMenu} onMenuChange={onMenuChange} />
      )}

      {/* Main content area */}
      <View style={styles.mainContent} accessibilityLabel={t('accessibility.layout.applicationMainArea')}>
        {/* Header */}
        <Header 
          title={title}
        />

        {/* Page content */}
        <ScrollView
          style={styles.content}
          nativeID="main-content"
          accessibilityLabel={t('accessibility.layout.mainContent')}
          {...(Platform.OS === 'web' ? ({
            id: 'main-content',
            role: 'main',
            tabIndex: -1,
          } as never) : {})}
        >
          {children}
        </ScrollView>
      </View>

      {/* Bottom tab bar for mobile */}
      {showBottomTabs && (
        <BottomTabBar activeTab={activeMenu} onTabChange={onMenuChange} />
      )}

      {/* Floating element (e.g., Pomodoro player) */}
      {floatingElement}
    </SafeAreaView>
  );
}
