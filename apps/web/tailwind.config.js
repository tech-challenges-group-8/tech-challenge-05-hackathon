/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.js',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui-kit/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      spacing: {
        'cognitive-xs': 'calc(var(--spacing-unit) * 2)',
        'cognitive-sm': 'calc(var(--spacing-unit) * 3)',
        'cognitive-md': 'calc(var(--spacing-unit) * 4)',
        'cognitive-lg': 'calc(var(--spacing-unit) * 6)',
        'cognitive-xl': 'calc(var(--spacing-unit) * 8)',
      },
      fontSize: {
        'cognitive-xs': 'calc(var(--font-size-base) * 0.75)',
        'cognitive-sm': 'calc(var(--font-size-base) * 0.875)',
        'cognitive-base': 'var(--font-size-base)',
        'cognitive-lg': 'calc(var(--font-size-base) * 1.125)',
        'cognitive-xl': 'calc(var(--font-size-base) * 1.25)',
        'cognitive-2xl': 'calc(var(--font-size-base) * 1.5)',
      },
      borderRadius: {
        cognitive: 'var(--border-radius)',
      },
    },
  },
  plugins: [],
};
