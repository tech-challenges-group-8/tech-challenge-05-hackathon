import type {
  CognitiveSettings,
  FocusMode,
  Sensory,
  ThemeMode,
  Typography,
} from '../services';

export type CognitivePreset = 'default' | 'reading' | 'focus' | 'sensory' | 'emotion';

export interface CognitiveSettingsState {
  id?: string;
  userId?: string;
  themeMode: ThemeMode;
  typography: Typography;
  focusMode: FocusMode;
  sensory: Sensory;
}

export const DEFAULT_TYPOGRAPHY: Typography = {
  fontFamily: 'system',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textSize: 'normal',
};

export const DEFAULT_FOCUS_MODE: FocusMode = {
  hideSidebar: false,
  highlightActiveTask: false,
  animationsEnabled: true,
  simpleInterface: false,
};

export const DEFAULT_SENSORY: Sensory = {
  muteSounds: false,
  hideUrgencyIndicators: false,
};

export const DEFAULT_COGNITIVE_SETTINGS: CognitiveSettingsState = {
  themeMode: 'light',
  typography: DEFAULT_TYPOGRAPHY,
  focusMode: DEFAULT_FOCUS_MODE,
  sensory: DEFAULT_SENSORY,
};

export const COGNITIVE_PRESETS: Record<
  CognitivePreset,
  Omit<CognitiveSettingsState, 'id' | 'userId'>
> = {
  default: DEFAULT_COGNITIVE_SETTINGS,
  reading: {
    themeMode: 'light',
    typography: {
      fontFamily: 'dyslexia-friendly',
      lineHeight: 'loose',
      letterSpacing: 'wide',
      textSize: 'large',
    },
    focusMode: {
      hideSidebar: false,
      highlightActiveTask: false,
      animationsEnabled: true,
      simpleInterface: false,
    },
    sensory: {
      muteSounds: false,
      hideUrgencyIndicators: false,
    },
  },
  focus: {
    themeMode: 'light',
    typography: {
      fontFamily: 'system',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      textSize: 'normal',
    },
    focusMode: {
      hideSidebar: true,
      highlightActiveTask: true,
      animationsEnabled: false,
      simpleInterface: true,
    },
    sensory: {
      muteSounds: true,
      hideUrgencyIndicators: false,
    },
  },
  sensory: {
    themeMode: 'soft-pastel',
    typography: {
      fontFamily: 'system',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      textSize: 'normal',
    },
    focusMode: {
      hideSidebar: false,
      highlightActiveTask: false,
      animationsEnabled: false,
      simpleInterface: false,
    },
    sensory: {
      muteSounds: true,
      hideUrgencyIndicators: true,
    },
  },
  emotion: {
    themeMode: 'soft-pastel',
    typography: {
      fontFamily: 'system',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      textSize: 'normal',
    },
    focusMode: {
      hideSidebar: false,
      highlightActiveTask: false,
      animationsEnabled: true,
      simpleInterface: false,
    },
    sensory: {
      muteSounds: false,
      hideUrgencyIndicators: true,
    },
  },
};

export function normalizeCognitiveSettings(
  settings?: Partial<CognitiveSettingsState> | Partial<CognitiveSettings> | null,
  userId?: string,
): CognitiveSettingsState {
  return {
    id: settings?.id,
    userId: userId ?? settings?.userId,
    themeMode: settings?.themeMode ?? DEFAULT_COGNITIVE_SETTINGS.themeMode,
    typography: {
      ...DEFAULT_TYPOGRAPHY,
      ...settings?.typography,
    },
    focusMode: {
      ...DEFAULT_FOCUS_MODE,
      ...settings?.focusMode,
    },
    sensory: {
      ...DEFAULT_SENSORY,
      ...settings?.sensory,
    },
  };
}

export function detectCurrentPreset(settings: CognitiveSettingsState): CognitivePreset | null {
  const comparableSettings = normalizeCognitiveSettings(settings);

  for (const [presetName, presetSettings] of Object.entries(COGNITIVE_PRESETS)) {
    if (JSON.stringify(comparableSettings) === JSON.stringify(normalizeCognitiveSettings(presetSettings))) {
      return presetName as CognitivePreset;
    }
  }

  return null;
}