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
        bg: '#eef3f4',
        'bg-2': '#e4ebed',
        'bg-3': '#d9e5e7',
        surface: 'rgba(255,255,255,0.62)',
        'surface-2': 'rgba(43,69,72,0.12)',
        violet: {
          DEFAULT: '#427f83',
          2: '#5aa0a4',
          3: '#83b9bd',
          dim: 'rgba(66,127,131,0.16)',
        },
        brand: {
          DEFAULT: '#427f83',
          light: '#83b9bd',
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
