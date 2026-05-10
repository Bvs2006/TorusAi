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
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        'bg-3': 'var(--bg-3)',
        surface: 'var(--surface)',
        text: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
        },
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        error: 'var(--error)',
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
