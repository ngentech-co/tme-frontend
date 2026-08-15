import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: 'rgb(var(--color-cream) / <alpha-value>)',
          paper: 'rgb(var(--color-cream-paper) / <alpha-value>)',
          deep: 'rgb(var(--color-cream-deep) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--color-paper) / <alpha-value>)',
          deep: 'rgb(var(--color-paper-deep) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          soft: 'rgb(var(--color-ink-soft) / <alpha-value>)',
        },
        seal: {
          DEFAULT: 'rgb(var(--color-seal) / <alpha-value>)',
          deep: 'rgb(var(--color-seal-deep) / <alpha-value>)',
          soft: 'rgb(var(--color-seal-soft) / <alpha-value>)',
        },
        wax: {
          gold: 'rgb(var(--color-wax) / <alpha-value>)',
          dark: 'rgb(var(--color-wax-dark) / <alpha-value>)',
        },
        border: {
          subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['4rem', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-md': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-md': ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body': ['1.0625rem', { lineHeight: '1.6' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.55' }],
        'mono': ['0.9375rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      maxWidth: {
        'reading': '68ch',
        'prose': '46rem',
        'wide': '76rem',
      },
      borderRadius: {
        'paper': '6px',
        'card': '12px',
        'seal': '999px',
      },
      boxShadow: {
        'paper': '0 4px 24px rgba(26, 24, 20, 0.06)',
        'paper-lg': '0 12px 48px rgba(26, 24, 20, 0.08)',
        'seal': '0 8px 32px rgba(181, 57, 42, 0.25)',
        'inset-paper': 'inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      },
      keyframes: {
        'seal-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9' },
        },
        'seal-break': {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '40%': { transform: 'scale(1.1) rotate(-4deg)', opacity: '0.95' },
          '100%': { transform: 'scale(1.4) rotate(15deg)', opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ink-spread': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
      animation: {
        'seal-pulse': 'seal-pulse 2.4s ease-in-out infinite',
        'seal-break': 'seal-break 1.2s ease-out forwards',
        'fade-up': 'fade-up 600ms ease-out forwards',
        'fade-in': 'fade-in 600ms ease-out forwards',
        'ink-spread': 'ink-spread 800ms ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
