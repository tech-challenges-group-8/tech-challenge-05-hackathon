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
