/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: 'rgb(var(--sentinel-bg) / <alpha-value>)',
          card: 'rgb(var(--sentinel-card) / <alpha-value>)',
          surface: 'rgb(var(--sentinel-surface) / <alpha-value>)',
          border: 'rgb(var(--sentinel-border) / <alpha-value>)',
          hover: 'rgb(var(--sentinel-hover) / <alpha-value>)',
          accent: 'rgb(var(--sentinel-accent) / <alpha-value>)',
          accentGlow: 'rgb(var(--sentinel-accent-glow) / <alpha-value>)',
          warning: '#f59e0b',
          critical: '#ef4444',
          success: '#10b981',
          muted: '#8e9bb0',
          text: '#f1f5f9'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 210, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 210, 255, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
