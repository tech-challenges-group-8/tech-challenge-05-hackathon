export const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  white: '#FFFFFF',
  black: '#000000',

  background: 'hsl(45 33% 98%)', // #FCFBF9
  foreground: 'hsl(213 22% 20%)', // #293340

  border: 'hsl(40 10% 89%)', // #E4E3E1
  input: 'hsl(40 10% 89%)', // #E4E3E1
  ring: 'hsl(148 30% 43%)', // #528C6E

  primary: {
    DEFAULT: 'hsl(148 30% 43%)', // #528C6E
    foreground: 'hsl(0 0% 100%)', // #FFFFFF
    light: 'hsl(148 30% 53%)',
    dark: 'hsl(148 30% 33%)',
  },
  secondary: {
    DEFAULT: 'hsl(220 68% 95%)', // #E6ECF9
    foreground: 'hsl(218 25% 32%)', // #3D4D66
  },
  destructive: {
    DEFAULT: 'hsl(0 45% 60%)', // #C95E5E
    foreground: 'hsl(0 0% 100%)', // #FFFFFF
    light: 'hsl(0 45% 70%)',
    dark: 'hsl(0 45% 50%)',
  },
  muted: {
    DEFAULT: 'hsl(40 11% 92%)', // #EBEAE8
    foreground: 'hsl(214 10% 51%)', // #737C8C
  },
  accent: {
    DEFAULT: 'hsl(25 73% 94%)', // #F9EAE1
    foreground: 'hsl(24 33% 43%)', // #8C5E46
  },

  popover: {
    DEFAULT: 'hsl(0 0% 100%)', // #FFFFFF
    foreground: 'hsl(213 22% 20%)', // #293340
  },
  card: {
    DEFAULT: 'hsl(0 0% 100%)', // #FFFFFF
    foreground: 'hsl(213 22% 20%)', // #293340
  },

  // Semantic states for user feedback
  state: {
    success: {
      DEFAULT: 'hsl(145 35% 44%)', // #4D9973
      foreground: 'hsl(0 0% 100%)', // #FFFFFF
    },
    warning: {
      DEFAULT: 'hsl(38 78% 57%)', // #E6A540
      foreground: 'hsl(38 61% 25%)', // #664919
    },
    info: {
      DEFAULT: 'hsl(210 80% 60%)',
      foreground: 'hsl(0 0% 100%)',
    },
  },

  // Tokens specific to cognitive adjustments
  cognitive: {
    highlight: 'hsl(155 45% 84%)', // #C4E6D5 - A gentle highlight for focus
    taskActive: 'hsl(100 38% 87%)', // #D9EAD3 - To indicate an active/selected task
  },
}

// Theme definitions
export type ThemeName = 'light' | 'dark' | 'soft-pastel' | 'high-contrast';

export type ThemeTokens = {
  name: ThemeName;
  colors: {
    background: string;
    foreground: string;
    border: string;
    card: { DEFAULT: string; foreground: string };
    primary: { DEFAULT: string; foreground: string };
    secondary: { DEFAULT: string; foreground: string };
    destructive: { DEFAULT: string; foreground: string; light?: string; dark?: string };
    muted: { DEFAULT: string; foreground: string };
    accent: { DEFAULT: string; foreground: string };
    cognitive: { highlight: string };
    white: string;
    black: string;
  };
};

const lightTheme: ThemeTokens = {
  name: 'light',
  colors: {
    background: colors.background,
    foreground: colors.foreground,
    border: colors.border,
    card: colors.card,
    primary: colors.primary,
    secondary: colors.secondary,
    destructive: colors.destructive,
    muted: colors.muted,
    accent: colors.accent,
    cognitive: colors.cognitive,
    white: colors.white,
    black: colors.black,
  },
};

const darkTheme: ThemeTokens = {
  name: 'dark',
  colors: {
    background: 'hsl(222 18% 11%)',
    foreground: 'hsl(40 8% 95%)',
    border: 'hsl(213 22% 20%)',
    card: { DEFAULT: 'hsl(222 18% 14%)', foreground: 'hsl(40 8% 95%)' },
    primary: { DEFAULT: 'hsl(150 41% 55%)', foreground: 'hsl(222 18% 11%)' },
    secondary: { DEFAULT: 'hsl(213 22% 20%)', foreground: 'hsl(40 8% 93%)' },
    destructive: { DEFAULT: 'hsl(0 58% 58%)', foreground: 'hsl(0 0% 100%)' },
    muted: { DEFAULT: 'hsl(215 20% 19%)', foreground: 'hsl(40 5% 63%)' },
    accent: { DEFAULT: 'hsl(26 27% 33%)', foreground: 'hsl(28 50% 83%)' },
    cognitive: { highlight: 'hsl(148 40% 22%)' },
    white: '#FFFFFF',
    black: '#000000',
  },
};

const softPastelTheme: ThemeTokens = {
  name: 'soft-pastel',
  colors: {
    background: '#FFF8F6',
    foreground: '#4A3C3A',
    border: '#E8D8D4',
    card: { DEFAULT: '#FFFFFF', foreground: '#4A3C3A' },
    primary: { DEFAULT: '#B7D4C9', foreground: '#2F4A40' },
    secondary: { DEFAULT: '#EADFF6', foreground: '#5A4D7A' },
    destructive: { DEFAULT: '#D67C7C', foreground: '#FFFFFF' },
    muted: { DEFAULT: '#F2E9E7', foreground: '#7C6B67' },
    accent: { DEFAULT: '#FFE2C9', foreground: '#8C5E46' },
    cognitive: { highlight: '#E5F5EE' },
    white: '#FFFFFF',
    black: '#000000',
  },
};

const highContrastTheme: ThemeTokens = {
  name: 'high-contrast',
  colors: {
    background: '#000000',
    foreground: '#FFFFFF',
    border: '#FFFFFF',
    card: { DEFAULT: '#000000', foreground: '#FFFFFF' },
    primary: { DEFAULT: '#00FF6A', foreground: '#000000' },
    secondary: { DEFAULT: '#FFD400', foreground: '#000000' },
    destructive: { DEFAULT: '#FF4D4D', foreground: '#000000' },
    muted: { DEFAULT: '#000000', foreground: '#FFFFFF' },
    accent: { DEFAULT: '#00BFFF', foreground: '#000000' },
    cognitive: { highlight: '#1A1A1A' },
    white: '#FFFFFF',
    black: '#000000',
  },
};

export const themes: Record<ThemeName, ThemeTokens> = {
  light: lightTheme,
  dark: darkTheme,
  'soft-pastel': softPastelTheme,
  'high-contrast': highContrastTheme,
};
