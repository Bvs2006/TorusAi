'use client'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function ThemeToggle({ collapsed, style }: { collapsed?: boolean; style?: React.CSSProperties }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--text-heading)', transition: 'all 0.2s',
        padding: 0,
        ...style
      }}
      aria-label="Toggle Theme"
      onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--accent-teal)')}
      onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
