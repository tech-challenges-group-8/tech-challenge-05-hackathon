/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Usa classe .dark para dark mode (alinhado com ui-kit)
  content: [
    './index.js',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui-kit/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores alinhadas com o Design System do ui-kit (boilerplate.css)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        
        primary: {
          DEFAULT: 'var(--primary-default)',
          foreground: 'var(--primary-foreground)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-default)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent-default)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted-default)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive-default)',
          foreground: 'var(--destructive-foreground)',
          light: 'var(--destructive-light)',
          dark: 'var(--destructive-dark)',
        },
        
        // State colors do Design System
        success: {
          DEFAULT: 'var(--success-default)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning-default)',
          foreground: 'var(--warning-foreground)',
        },
        info: {
          DEFAULT: 'var(--info-default)',
          foreground: 'var(--info-foreground)',
        },
        
        // Card e Popover
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        
        // Cognitive tokens
        highlight: 'var(--highlight-soft)',
        'task-active': 'var(--task-active)',
      },
      
      fontFamily: {
        sans: ['var(--font-family-base)'],
        dyslexic: ['var(--font-family-dyslexic)'],
      },
      
      fontSize: {
        // Tamanhos elásticos baseados no scale factor
        sm: 'var(--text-size-sm)',
        base: 'var(--text-size-md)',
        lg: 'var(--text-size-lg)',
        xl: 'var(--text-size-xl)',
      },
      
      lineHeight: {
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },
      
      letterSpacing: {
        normal: 'var(--letter-spacing-normal)',
        wide: 'var(--letter-spacing-wide)',
        wider: 'var(--letter-spacing-wider)',
      },
      
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      
      boxShadow: {
        gentle: 'var(--gentle-shadow)',
        card: 'var(--card-shadow)',
      },
    },
  },
  plugins: [],
};
