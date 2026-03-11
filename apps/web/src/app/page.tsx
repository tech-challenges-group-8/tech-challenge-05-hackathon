import { View, StyleSheet, ScrollView, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { space } from '@mindease/ui-kit';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import {
  DashboardPage,
  TasksPage,
  FocusPage,
  CognitiveSettingsPage,
  LoginPage,
  RegisterPage,
} from './pages';
import { FloatingPomodoroPlayer } from './components/FloatingPomodoroPlayer';
import { useFocusTimer } from './context/FocusTimerContext';
import { useTheme } from '../theme';
import { useAuth } from '../auth';
import { KanbanPage } from './pages/KanbanPage';
import { useCognitivePreferences, useCognitiveSettings } from '../cognitive';
import { rem } from '../utils';

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
    tabBar: {
      height: 64,
      backgroundColor: themeColors.white,
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
    },
    tabItemActive: {
      backgroundColor: themeColors.cognitive.highlight,
    },
    tabIcon: {
      fontSize: rem(space[4]),
      color: themeColors.foreground,
    },
    tabIconActive: {
      color: themeColors.primary.DEFAULT,
    },
  });

const PATH_BY_MENU: Record<string, string> = {
  dashboard: '/',
  tasks: '/tasks',
  focus: '/focus',
  cognitive: '/cognitive',
  kanban: '/kanban',
};

const MENU_BY_PATH: Record<string, string> = {
  '/': 'dashboard',
  '/tasks': 'tasks',
  '/focus': 'focus',
  '/cognitive': 'cognitive',
  '/kanban': 'kanban',
};

const BOTTOM_TABS = [
  { id: 'dashboard', icon: '📊' },
  { id: 'tasks', icon: '✓' },
  { id: 'kanban', icon: '✓' },
  { id: 'focus', icon: '🎯' },
  { id: 'cognitive', icon: '🧠' },
];

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { currentUser, isLoading } = useAuth();
  const { isLoading: isLoadingCognitive } = useCognitiveSettings();
  const cognitivePreferences = useCognitivePreferences();
  const { isActive, mode, isFloatingPlayerDismissed } = useFocusTimer();
  const styles = useMemo(
    () => createStyles(theme.colors, cognitivePreferences.simpleInterface),
    [cognitivePreferences.simpleInterface, theme.colors],
  );

  const handleNewTask = () => {
    console.log(t('actions.newTaskClicked'));
  };

  const handleProfile = () => {
    console.log(t('actions.profileClicked'));
  };

  const handleMenuChange = (menuId: string) => {
    setActiveMenu(menuId);

    if (Platform.OS !== 'web') return;
    if (globalThis.window === undefined) return;

    const nextPath = PATH_BY_MENU[menuId] ?? '/';
    if (globalThis.window.location.pathname !== nextPath) {
      globalThis.window.history.pushState({}, '', nextPath);
    }
  };

  const pageTitleByMenu: Record<string, string> = {
    dashboard: t('menu.dashboard'),
    tasks: t('menu.tasks'),
    kanban: t('menu.kanban'),
    focus: t('menu.focus'),
    cognitive: t('menu.cognitive'),
  };

  const renderPageContent = () => {
    switch (activeMenu) {
      case 'tasks':
        return <TasksPage />;
      case 'kanban':
        return <KanbanPage />;
      case 'focus':
        return <FocusPage />;
      case 'cognitive':
        return <CognitiveSettingsPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (globalThis.window === undefined) return;

    const syncFromLocation = () => {
      const pathname = globalThis.window.location.pathname;
      const menu = MENU_BY_PATH[pathname] ?? 'dashboard';
      setActiveMenu(menu);
    };

    syncFromLocation();
    globalThis.window.addEventListener('popstate', syncFromLocation);

    return () => {
      globalThis.window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  if (isLoading || (currentUser && isLoadingCognitive)) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.mainContent}>
          <ScrollView style={styles.content}>
            <Text>{t('login.loading')}</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return isRegistering ? (
      <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {Platform.OS === 'web' && !cognitivePreferences.hideSidebar && (
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
            {BOTTOM_TABS.map((tab) => (
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

      {!isFloatingPlayerDismissed &&
        (isActive || mode === 'SHORT_BREAK' || mode === 'LONG_BREAK') &&
        activeMenu !== 'focus' && (
          <FloatingPomodoroPlayer
            onNavigateToFocus={() => handleMenuChange('focus')}
          />
        )}
    </SafeAreaView>
  );
}
