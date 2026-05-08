/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f7f3ea',
        'bg-2': '#eee7d8',
        'bg-3': '#e3d8c1',
        surface: 'rgba(255,255,255,0.72)',
        'surface-2': 'rgba(24,45,56,0.12)',
        violet: {
          DEFAULT: '#0f766e',
          2: '#0891b2',
          3: '#f97316',
          dim: 'rgba(15,118,110,0.16)',
        },
        brand: {
          DEFAULT: '#0f766e',
          light: '#f97316',
        },
        text: {
          DEFAULT: '#182d38',
          2: '#526977',
          3: '#81919a',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-dot': 'pulse 2s ease infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
