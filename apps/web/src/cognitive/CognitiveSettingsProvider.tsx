import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { useAuth } from '../auth';
import {
  cognitiveSettingsService,
  type FocusMode,
  type ThemeMode,
  type UpdateCognitiveSettingsDTO,
  type Typography,
  type Sensory,
} from '../services';
import { useTheme } from '../theme';
import {
  COGNITIVE_PRESETS,
  DEFAULT_COGNITIVE_SETTINGS,
  detectCurrentPreset,
  normalizeCognitiveSettings,
  type CognitivePreset,
  type CognitiveSettingsState,
} from './model';

const STORAGE_KEY = 'mindease-cognitive-settings';

interface CognitiveSettingsContextValue {
  settings: CognitiveSettingsState;
  currentPreset: CognitivePreset | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateSettings: (settings: UpdateCognitiveSettingsDTO) => void;
  updateTypography: (typography: Partial<Typography>) => void;
  updateFocusMode: (focusMode: Partial<FocusMode>) => void;
  updateSensory: (sensory: Partial<Sensory>) => void;
  setTheme: (themeMode: ThemeMode) => void;
  applyPreset: (preset: CognitivePreset) => void;
  resetToDefault: () => void;
}

const CognitiveSettingsContext = createContext<CognitiveSettingsContextValue | null>(null);

function getStorageKey(userId?: string) {
  return userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
}

async function readCachedSettings(userId?: string) {
  if (!userId) {
    return null;
  }

  try {
    const stored = await AsyncStorage.getItem(getStorageKey(userId));
    if (!stored) {
      return null;
    }

    return normalizeCognitiveSettings(JSON.parse(stored) as CognitiveSettingsState, userId);
  } catch (error) {
    console.error('Failed to restore cached cognitive settings:', error);
    return null;
  }
}

async function cacheSettings(settings: CognitiveSettingsState) {
  if (!settings.userId) {
    return;
  }

  try {
    await AsyncStorage.setItem(getStorageKey(settings.userId), JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to cache cognitive settings:', error);
  }
}

function isAxiosLikeError(error: unknown): error is {
  message?: string;
  response?: { status?: number; data?: { message?: string } };
} {
  return typeof error === 'object' && error !== null && ('message' in error || 'response' in error);
}

function getErrorMessage(error: unknown) {
  if (isAxiosLikeError(error)) {
    return error.response?.data?.message ?? error.message ?? 'Unexpected error';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
}

function buildUpdate(
  previous: CognitiveSettingsState,
  update: UpdateCognitiveSettingsDTO,
  userId?: string,
) {
  return normalizeCognitiveSettings(
    {
      ...previous,
      ...update,
      typography: {
        ...previous.typography,
        ...update.typography,
      },
      focusMode: {
        ...previous.focusMode,
        ...update.focusMode,
      },
      sensory: {
        ...previous.sensory,
        ...update.sensory,
      },
    },
    userId ?? previous.userId,
  );
}

export function CognitiveSettingsProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { setThemeName } = useTheme();
  const [settings, setSettings] = useState<CognitiveSettingsState>(DEFAULT_COGNITIVE_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);
  const hasRemoteSettings = useRef(false);

  const refresh = useCallback(async () => {
    if (!currentUser?.id) {
      setSettings(DEFAULT_COGNITIVE_SETTINGS);
      setError(null);
      setIsDirty(false);
      setHasBootstrapped(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasBootstrapped(false);

    const cached = await readCachedSettings(currentUser.id);
    if (cached) {
      setSettings(cached);
    } else {
      setSettings(normalizeCognitiveSettings(undefined, currentUser.id));
    }

    try {
      const remoteSettings = await cognitiveSettingsService.getSettings();
      const normalizedSettings = normalizeCognitiveSettings(remoteSettings, currentUser.id);
      hasRemoteSettings.current = true;
      setSettings(normalizedSettings);
      await cacheSettings(normalizedSettings);
    } catch (requestError) {
      if (isAxiosLikeError(requestError) && requestError.response?.status === 404) {
        hasRemoteSettings.current = false;
        if (!cached) {
          const fallbackSettings = normalizeCognitiveSettings(undefined, currentUser.id);
          setSettings(fallbackSettings);
          await cacheSettings(fallbackSettings);
        }
      } else {
        setError(getErrorMessage(requestError));
        hasRemoteSettings.current = Boolean(cached);
        if (!cached) {
          const fallbackSettings = normalizeCognitiveSettings(undefined, currentUser.id);
          setSettings(fallbackSettings);
        }
      }
    } finally {
      setIsDirty(false);
      setIsLoading(false);
      setHasBootstrapped(true);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setThemeName(settings.themeMode);

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.colorScheme = settings.themeMode === 'dark' ? 'dark' : 'light';
      document.documentElement.style.scrollBehavior = settings.focusMode.animationsEnabled ? 'smooth' : 'auto';
    }
  }, [setThemeName, settings.focusMode.animationsEnabled, settings.themeMode]);

  useEffect(() => {
    if (!hasBootstrapped || !currentUser?.id || !isDirty) {
      return;
    }

    const timeoutId = globalThis.setTimeout(async () => {
      setIsSaving(true);
      setError(null);

      const payload: UpdateCognitiveSettingsDTO = {
        themeMode: settings.themeMode,
        typography: settings.typography,
        focusMode: settings.focusMode,
        sensory: settings.sensory,
      };

      try {
        const savedSettings = hasRemoteSettings.current
          ? await cognitiveSettingsService.updateSettings(payload)
          : await cognitiveSettingsService.createSettings(payload);

        const normalizedSettings = normalizeCognitiveSettings(savedSettings, currentUser.id);
        hasRemoteSettings.current = true;
        setSettings(normalizedSettings);
        await cacheSettings(normalizedSettings);
        setIsDirty(false);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setIsSaving(false);
      }
    }, 500);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [currentUser?.id, hasBootstrapped, isDirty, settings]);

  const updateSettings = useCallback(
    (update: UpdateCognitiveSettingsDTO) => {
      setSettings((previous) => buildUpdate(previous, update, currentUser?.id));
      setIsDirty(true);
      setError(null);
    },
    [currentUser?.id],
  );

  const updateTypography = useCallback(
    (typography: Partial<Typography>) => {
      updateSettings({ typography });
    },
    [updateSettings],
  );

  const updateFocusMode = useCallback(
    (focusMode: Partial<FocusMode>) => {
      updateSettings({ focusMode });
    },
    [updateSettings],
  );

  const updateSensory = useCallback(
    (sensory: Partial<Sensory>) => {
      updateSettings({ sensory });
    },
    [updateSettings],
  );

  const setTheme = useCallback(
    (themeMode: ThemeMode) => {
      updateSettings({ themeMode });
    },
    [updateSettings],
  );

  const applyPreset = useCallback(
    (preset: CognitivePreset) => {
      const presetSettings = COGNITIVE_PRESETS[preset];
      setSettings((previous) => normalizeCognitiveSettings({ ...previous, ...presetSettings }, currentUser?.id));
      setIsDirty(true);
      setError(null);
    },
    [currentUser?.id],
  );

  const resetToDefault = useCallback(() => {
    setSettings(normalizeCognitiveSettings(undefined, currentUser?.id));
    setIsDirty(true);
    setError(null);
  }, [currentUser?.id]);

  const currentPreset = useMemo(() => detectCurrentPreset(settings), [settings]);

  const value = useMemo(
    () => ({
      settings,
      currentPreset,
      isLoading,
      isSaving,
      error,
      refresh,
      updateSettings,
      updateTypography,
      updateFocusMode,
      updateSensory,
      setTheme,
      applyPreset,
      resetToDefault,
    }),
    [
      currentPreset,
      error,
      isLoading,
      isSaving,
      refresh,
      resetToDefault,
      setTheme,
      settings,
      updateFocusMode,
      updateSensory,
      updateSettings,
      updateTypography,
      applyPreset,
    ],
  );

  return (
    <CognitiveSettingsContext.Provider value={value}>
      {children}
    </CognitiveSettingsContext.Provider>
  );
}

export function useCognitiveSettings() {
  const context = useContext(CognitiveSettingsContext);

  if (!context) {
    throw new Error('useCognitiveSettings must be used within CognitiveSettingsProvider');
  }

  return context;
}

export function useCognitivePreferences() {
  const { settings } = useCognitiveSettings();

  return useMemo(() => {
    const fontScaleMap = {
      normal: 1,
      large: 1.15,
      'extra-large': 1.3,
    } as const;

    const lineHeightMap = {
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    } as const;

    const letterSpacingMap = {
      normal: 0,
      wide: 0.6,
    } as const;

    return {
      fontScale: fontScaleMap[settings.typography.textSize],
      lineHeightMultiplier: lineHeightMap[settings.typography.lineHeight],
      letterSpacing: letterSpacingMap[settings.typography.letterSpacing],
      fontFamily:
        settings.typography.fontFamily === 'dyslexia-friendly'
          ? Platform.select({
              web: 'OpenDyslexic, Verdana, Arial, sans-serif',
              default: undefined,
            })
          : undefined,
      ...settings.focusMode,
      ...settings.sensory,
      themeMode: settings.themeMode,
    };
  }, [settings]);
}