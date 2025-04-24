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
        background: {
          primary: 'rgb(var(--color-background-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-background-secondary) / <alpha-value>)',
          surface: 'rgb(var(--color-background-surface) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        accent: {
          blue: 'rgb(var(--color-accent-blue) / <alpha-value>)',
          purple: 'rgb(var(--color-accent-purple) / <alpha-value>)',
          green: 'rgb(var(--color-accent-green) / <alpha-value>)',
          amber: 'rgb(var(--color-accent-amber) / <alpha-value>)',
          red: 'rgb(var(--color-accent-red) / <alpha-value>)',
        },
        // Type-specific colors
        type: {
          string: {
            DEFAULT: '#42a5f5',
            glow: '#1976d2',
          },
          number: {
            DEFAULT: '#ab47bc',
            glow: '#8e24aa',
          },
          boolean: {
            DEFAULT: '#66bb6a',
            glow: '#43a047',
          },
          object: {
            DEFAULT: '#ff9800',
            glow: '#f57c00',
          },
          image: {
            DEFAULT: '#ec407a',
            glow: '#d81b60',
          },
          audio: {
            DEFAULT: '#7e57c2',
            glow: '#5e35b1',
          },
          any: {
            DEFAULT: '#78909c',
            glow: '#546e7a',
          },
        },
      },
      boxShadow: {
        // Neomorphic shadows for dark mode
        'neu-normal':
          '0.5px 0.5px 0px rgba(255, 255, 255, 0.05), -0.5px -0.5px 0px rgba(0, 0, 0, 0.5), 5px 5px 10px rgba(0, 0, 0, 0.15), -5px -5px 10px rgba(255, 255, 255, 0.03)',
        'neu-pressed':
          'inset 0.5px 0.5px 2px rgba(0, 0, 0, 0.3), inset -0.5px -0.5px 2px rgba(255, 255, 255, 0.03), inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.01)',
        'neu-raised':
          '0.5px 0.5px 0px rgba(255, 255, 255, 0.1), -0.5px -0.5px 0px rgba(0, 0, 0, 0.4), 8px 8px 16px rgba(0, 0, 0, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.04)',
        
        // Neomorphic shadows for light mode
        'neu-light':
          '0.5px 0.5px 0px rgba(255, 255, 255, 0.7), -0.5px -0.5px 0px rgba(0, 0, 0, 0.1), 5px 5px 10px rgba(0, 0, 0, 0.05), -5px -5px 10px rgba(255, 255, 255, 0.8)',
        'neu-light-pressed':
          'inset 0.5px 0.5px 2px rgba(0, 0, 0, 0.1), inset -0.5px -0.5px 2px rgba(255, 255, 255, 0.5), inset 4px 4px 8px rgba(0, 0, 0, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
        'neu-light-raised':
          '0.5px 0.5px 0px rgba(255, 255, 255, 0.7), -0.5px -0.5px 0px rgba(0, 0, 0, 0.1), 8px 8px 16px rgba(0, 0, 0, 0.05), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        // Glow effects
        'glow-blue': '0 0 15px 2px rgba(56, 189, 248, 0.3), 0 0 4px 1px rgba(56, 189, 248, 0.7)',
        'glow-purple': '0 0 15px 2px rgba(186, 107, 249, 0.3), 0 0 4px 1px rgba(186, 107, 249, 0.7)',
        'glow-green': '0 0 15px 2px rgba(52, 211, 153, 0.3), 0 0 4px 1px rgba(52, 211, 153, 0.7)',
        'glow-amber': '0 0 15px 2px rgba(251, 191, 36, 0.3), 0 0 4px 1px rgba(251, 191, 36, 0.7)',
        'glow-red': '0 0 15px 2px rgba(248, 113, 113, 0.3), 0 0 4px 1px rgba(248, 113, 113, 0.7)',
      },
      keyframes: {
        // Animation keyframes
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'flow': {
          '0%': { transform: 'translateX(0%) translateY(0%)' },
          '100%': { transform: 'translateX(100%) translateY(0%)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            filter: 'brightness(1)',
            boxShadow: '0 0 10px 2px rgba(56, 189, 248, 0.2), 0 0 4px 1px rgba(56, 189, 248, 0.6)'
          },
          '50%': { 
            filter: 'brightness(1.2)',
            boxShadow: '0 0 15px 3px rgba(56, 189, 248, 0.3), 0 0 8px 2px rgba(56, 189, 248, 0.8)'
          },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'flow': 'flow 2s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'scale-in': 'scale-in 0.3s ease-in-out',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundColor: {
        // Glassmorphic background styles
        'glass-dark': 'rgba(15, 23, 42, 0.7)',
        'glass-light': 'rgba(255, 255, 255, 0.7)',
        'glass-dark-hover': 'rgba(30, 41, 59, 0.8)',
        'glass-light-hover': 'rgba(255, 255, 255, 0.8)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      // Background patterns
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        'grid-pattern': '30px 30px',
      },
      // Glass effects
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
        'blur-sm': 'blur(4px)',
        'blur-lg': 'blur(12px)',
      }
    },
  },
  plugins: [],
}