import { useTranslation } from 'react-i18next';
import {
  DashboardPage,
  TasksPage,
  FocusPage,
  CognitiveSettingsPage,
} from './pages';
import { KanbanPage } from './pages/KanbanPage';
import { FloatingPomodoroPlayer } from './components/FloatingPomodoroPlayer';
import { AppLayout } from './components/AppLayout';
import { AuthGate } from './components/AuthGate';
import { useClientRouter } from './hooks/useClientRouter';
import { useFocusTimer } from './context/FocusTimerContext';

/**
 * Page content renderer.
 * Maps active menu to the corresponding page component.
 */
function renderPageContent(activeMenu: string) {
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
}

/**
 * Main application component.
 * Handles authentication, routing, and layout composition.
 */
export default function Home() {
  const { t } = useTranslation();
  const { activeMenu, navigateTo } = useClientRouter('dashboard');
  const { isActive, mode, isFloatingPlayerDismissed } = useFocusTimer();

  const pageTitleByMenu: Record<string, string> = {
    dashboard: t('menu.dashboard'),
    tasks: t('menu.tasks'),
    kanban: t('menu.kanban'),
    focus: t('menu.focus'),
    cognitive: t('menu.cognitive'),
  };

  const floatingElement =
    !isFloatingPlayerDismissed &&
    (isActive || mode === 'SHORT_BREAK' || mode === 'LONG_BREAK') &&
    activeMenu !== 'focus' ? (
      <FloatingPomodoroPlayer onNavigateToFocus={() => navigateTo('focus')} />
    ) : null;

  return (
    <AuthGate>
      <AppLayout
        activeMenu={activeMenu}
        onMenuChange={navigateTo}
        title={pageTitleByMenu[activeMenu] ?? t('menu.dashboard')}
        floatingElement={floatingElement}
      >
        {renderPageContent(activeMenu)}
      </AppLayout>
    </AuthGate>
  );
}
