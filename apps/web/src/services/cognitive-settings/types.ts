export type ThemeMode = 'light' | 'dark' | 'soft-pastel' | 'high-contrast';

export interface Typography {
  fontFamily: string;
  lineHeight: string;
  letterSpacing: string;
  textSize: string;
}

export interface FocusMode {
  hideSidebar: boolean;
  highlightActiveTask: boolean;
  animationsEnabled: boolean;
  simpleInterface: boolean;
}

export interface Sensory {
  muteSounds: boolean;
  hideUrgencyIndicators: boolean;
}

export interface CognitiveSettings {
  id: string;
  userId: string;
  themeMode: ThemeMode;
  typography: Typography;
  focusMode: FocusMode;
  sensory: Sensory;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCognitiveSettingsDTO {
  themeMode?: ThemeMode;
  typography?: Typography;
  focusMode?: FocusMode;
  sensory?: Sensory;
}

export interface UpdateCognitiveSettingsDTO {
  themeMode?: ThemeMode;
  typography?: Typography;
  focusMode?: FocusMode;
  sensory?: Sensory;
}
