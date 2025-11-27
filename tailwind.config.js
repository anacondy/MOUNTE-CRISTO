/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'monte': {
          'bg': '#1a120b',
          'paper': '#eaddcf',
          'accent': '#d44d38',
          'border': '#3e3228',
          'dark': '#261f1a',
          'muted': '#8c7b70',
          'subtle': '#5c4d44'
        }
      },
      fontFamily: {
        'serif': ['Cinzel', 'serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'fadeInDown': 'fadeInDown 1s ease-out',
        'fadeInUp': 'fadeInUp 1s ease-out',
        'fadeInOut': 'fadeInOut 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 10s linear infinite'
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '20%': { opacity: '1', transform: 'scale(1)' },
          '80%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.1)' }
        }
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Aspect ratio-based breakpoints for 16:9 and 20:9 devices
        'aspect-16-9': { 'raw': '(min-aspect-ratio: 16/9)' },
        'aspect-20-9': { 'raw': '(min-aspect-ratio: 20/9)' }
      }
    },
  },
  plugins: [],
}
