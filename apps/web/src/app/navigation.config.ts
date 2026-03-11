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
  label?: string;
}

export const BOTTOM_TABS: BottomTab[] = [
  { id: 'dashboard', icon: '📊' },
  { id: 'tasks', icon: '✓' },
  { id: 'kanban', icon: '✓' },
  { id: 'focus', icon: '🎯' },
  { id: 'cognitive', icon: '🧠' },
];
