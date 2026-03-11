/**
 * Navigation configuration for the app.
 * Centralizes routing paths, menu mappings, and tab configuration.
 */

export const PATH_BY_MENU: Record<string, string> = {
  dashboard: '/',
  tasks: '/tasks',
  focus: '/focus',
  cognitive: '/cognitive',
  kanban: '/kanban',
};

export const MENU_BY_PATH: Record<string, string> = {
  '/': 'dashboard',
  '/tasks': 'tasks',
  '/focus': 'focus',
  '/cognitive': 'cognitive',
  '/kanban': 'kanban',
};

export interface BottomTab {
  id: string;
  icon: string;
  labelKey: string;
  accessibilityLabelKey: string;
}

export const BOTTOM_TABS: BottomTab[] = [
  { id: 'dashboard', icon: '📊', labelKey: 'menu.dashboard', accessibilityLabelKey: 'accessibility.navigation.dashboard' },
  { id: 'tasks', icon: '✓', labelKey: 'menu.tasks', accessibilityLabelKey: 'accessibility.navigation.tasks' },
  { id: 'kanban', icon: '📋', labelKey: 'menu.kanban', accessibilityLabelKey: 'accessibility.navigation.kanban' },
  { id: 'focus', icon: '🎯', labelKey: 'menu.focus', accessibilityLabelKey: 'accessibility.navigation.focus' },
  {
    id: 'cognitive',
    icon: '🧠',
    labelKey: 'menu.cognitive',
    accessibilityLabelKey: 'accessibility.navigation.cognitive',
  },
];
