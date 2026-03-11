/**
 * Platform-safe window object getter.
 * Safely checks if window is available before accessing it.
 */
export function getWindowObject(): Window | null {
  if (typeof globalThis === 'undefined') return null;
  if (typeof globalThis.window === 'undefined') return null;
  return globalThis.window;
}

/**
 * Check if code is running in a web environment.
 */
export function isWebPlatform(): boolean {
  return getWindowObject() !== null;
}
