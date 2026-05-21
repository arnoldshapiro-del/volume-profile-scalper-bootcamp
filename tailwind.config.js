/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background base
        'bg-base': '#0A0E1A',
        'bg-elevated': '#131B2E',
        'bg-card': '#1A2540',
        'border-subtle': '#2A3654',
        // Text
        'text-primary': '#E8ECF4',
        'text-secondary': '#8B95B0',
        'text-muted': '#5A6580',
        // Profile colors
        'poc-gold': '#FFD700',
        'hvn-teal': '#14B8A6',
        'lvn-amber': '#F59E0B',
        'va-purple': '#A78BFA',
        // Trade colors
        'bull-green': '#10B981',
        'bear-red': '#EF4444',
        'accent-blue': '#3B82F6',
      },
      fontFamily: {
        head: ['Oxanium', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        flash: {
          '0%, 100%': { backgroundColor: 'rgba(16, 185, 129, 0)' },
          '50%': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        flash: 'flash 0.6s ease-in-out',
        'fade-up': 'fadeUp 200ms ease-out forwards',
      },
    },
  },
  plugins: [],
}
