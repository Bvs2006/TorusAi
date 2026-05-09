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
        bg: '#FAFAFA',
        'bg-2': '#F4F4F5',
        'bg-3': '#E8E8EC',
        surface: '#FFFFFF',
        'surface-2': '#E8E8EC',
        violet: {
          DEFAULT: '#6366F1',
          2: '#4F46E5',
          3: '#20970B',
          dim: 'rgba(99,102,241,0.12)',
        },
        brand: {
          DEFAULT: '#6366F1',
          light: '#20970B',
        },
        text: {
          DEFAULT: '#0A0A0A',
          2: '#6B6B6B',
          3: '#9C9C9C',
        },
      },
      fontFamily: {
        display: ['General Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
