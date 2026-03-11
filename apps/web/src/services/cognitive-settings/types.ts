export type ThemeMode = 'light' | 'dark' | 'soft-pastel' | 'high-contrast';

export type FontFamily = 'system' | 'dyslexia-friendly';
export type LineHeight = 'normal' | 'relaxed' | 'loose';
export type LetterSpacing = 'normal' | 'wide';
export type TextSize = 'normal' | 'large' | 'extra-large';

export interface Typography {
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  textSize: TextSize;
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
  id?: string;
  userId?: string;
  themeMode: ThemeMode;
  typography: Typography;
  focusMode: FocusMode;
  sensory: Sensory;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCognitiveSettingsDTO {
  themeMode?: ThemeMode;
  typography?: Partial<Typography>;
  focusMode?: Partial<FocusMode>;
  sensory?: Partial<Sensory>;
}
