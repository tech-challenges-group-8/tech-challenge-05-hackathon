import { View, StyleSheet, ScrollView, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors, space } from '@mindease/ui-kit';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import {
  DashboardPage,
  TasksPage,
  FocusPage,
  CognitiveSettingsPage,
  AnalyticsPage,
  SettingsPage,
} from './pages';

// Helper to convert rem to pixels (assuming 16px base)
const rem = (value: string) => parseFloat(value) * 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: rem(space[6]),
  },
  tabBar: {
    height: 64,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
  },
  tabItemActive: {
    backgroundColor: colors.cognitive.highlight,
  },
  tabIcon: {
    fontSize: rem(space[4]),
    color: colors.foreground,
  },
  tabIconActive: {
    color: colors.primary.DEFAULT,
  },
});

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { t } = useTranslation();

  const pathByMenu: Record<string, string> = {
    dashboard: '/',
    tasks: '/tasks',
    focus: '/focus',
    cognitive: '/cognitive',
    analytics: '/analytics',
    settings: '/settings',
  };

  const menuByPath: Record<string, string> = {
    '/': 'dashboard',
    '/tasks': 'tasks',
    '/focus': 'focus',
    '/cognitive': 'cognitive',
    '/analytics': 'analytics',
    '/settings': 'settings',
  };

  const bottomTabs = [
    { id: 'dashboard', icon: '📊' },
    { id: 'tasks', icon: '✓' },
    { id: 'focus', icon: '🎯' },
    { id: 'settings', icon: '⚙️' },
  ];

  const handleNewTask = () => {
    console.log(t('actions.newTaskClicked'));
  };

  const handleProfile = () => {
    console.log(t('actions.profileClicked'));
  };

  const handleMenuChange = (menuId: string) => {
    setActiveMenu(menuId);

    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;

    const nextPath = pathByMenu[menuId] ?? '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  const pageTitleByMenu: Record<string, string> = {
    dashboard: t('menu.dashboard'),
    tasks: t('menu.tasks'),
    focus: t('menu.focus'),
    cognitive: t('menu.cognitive'),
    analytics: t('menu.analytics'),
    settings: t('menu.settings'),
  };

  const renderPageContent = () => {
    switch (activeMenu) {
      case 'tasks':
        return <TasksPage />;
      case 'focus':
        return <FocusPage />;
      case 'cognitive':
        return <CognitiveSettingsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;

    const syncFromLocation = () => {
      const pathname = window.location.pathname;
      const menu = menuByPath[pathname] ?? 'dashboard';
      setActiveMenu(menu);
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);

    return () => {
      window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {Platform.OS === 'web' && (
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
      )}

      <View style={styles.mainContent}>
        <Header 
          title={pageTitleByMenu[activeMenu] ?? t('menu.dashboard')}
          onNewTask={handleNewTask}
          onProfile={handleProfile}
        />

        <ScrollView style={styles.content}>
          {renderPageContent()}
        </ScrollView>
      </View>

      {Platform.OS !== 'web' && (
        <SafeAreaView edges={['bottom']}>
          <View style={styles.tabBar}>
            {bottomTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabItem,
                  activeMenu === tab.id && styles.tabItemActive,
                ]}
                onPress={() => handleMenuChange(tab.id)}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    activeMenu === tab.id && styles.tabIconActive,
                  ]}
                >
                  {tab.icon}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
