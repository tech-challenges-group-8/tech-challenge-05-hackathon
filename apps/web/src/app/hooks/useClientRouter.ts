import { useEffect, useState } from 'react';
import { MENU_BY_PATH, PATH_BY_MENU } from '../navigation.config';
import { getWindowObject } from '../../utils/platform';

/**
 * Custom hook to manage client-side routing.
 * Synchronizes menu state with browser history on web platform.
 */
export function useClientRouter(initialMenu: string = 'dashboard') {
  const [activeMenu, setActiveMenu] = useState(initialMenu);

  const navigateTo = (menuId: string) => {
    setActiveMenu(menuId);

    // Only sync with browser history on web
    const windowObj = getWindowObject();
    if (!windowObj?.location || !windowObj.history?.pushState) return;

    const nextPath = PATH_BY_MENU[menuId] ?? '/';
    if (windowObj.location.pathname !== nextPath) {
      windowObj.history.pushState({}, '', nextPath);
    }
  };

  // Sync from browser location on mount and popstate (back button)
  useEffect(() => {
    const windowObj = getWindowObject();
    if (
      !windowObj?.location ||
      typeof windowObj.addEventListener !== 'function' ||
      typeof windowObj.removeEventListener !== 'function'
    ) {
      return;
    }

    const syncFromLocation = () => {
      const pathname = windowObj.location.pathname;
      const menu = MENU_BY_PATH[pathname] ?? 'dashboard';
      setActiveMenu(menu);
    };

    syncFromLocation();
    windowObj.addEventListener('popstate', syncFromLocation);

    return () => {
      windowObj.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  return { activeMenu, navigateTo };
}
