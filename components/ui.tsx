'use client'
// components/ui.tsx — All reusable UI components

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

// ── Button ──
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-display font-bold rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none'
    const variants = {
      primary: 'bg-violet-DEFAULT text-white shadow-lg shadow-violet-dim hover:bg-violet-2 hover:-translate-y-0.5',
      ghost: 'border border-surface-2 text-text-2 hover:border-violet-DEFAULT hover:text-text bg-white/40 backdrop-blur-xl',
      danger: 'border border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent',
      success: 'border border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ── Input ──
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-mono text-text-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-white/60 border border-surface-2 rounded-xl px-3.5 py-2.5 text-sm text-text placeholder-text-3 outline-none transition-all shadow-sm backdrop-blur-xl',
          'focus:border-violet-DEFAULT focus:ring-2 focus:ring-violet-dim',
          error && 'border-red-500/50 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-text-3 font-mono">{hint}</p>}
    </div>
  )
)
Input.displayName = 'Input'

// ── Textarea ──
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-mono text-text-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-white/60 border border-surface-2 rounded-xl px-3.5 py-2.5 text-sm text-text placeholder-text-3 outline-none transition-all resize-none shadow-sm backdrop-blur-xl',
          'focus:border-violet-DEFAULT focus:ring-2 focus:ring-violet-dim',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

// ── Card ──
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('telemetry-card p-5', className)} {...props}>
      {children}
    </div>
  )
}

// ── Badge ──
export function Badge({ children, rarity = 'common' }: { children: React.ReactNode; rarity?: string }) {
  const styles: Record<string, string> = {
    common: 'badge-common',
    rare: 'badge-rare',
    epic: 'badge-epic',
    legendary: 'badge-legendary',
  }
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-mono', styles[rarity] || styles.common)}>
      {children}
    </span>
  )
}

// ── Progress Bar ──
export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1 bg-surface-2 rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-gradient-to-r from-violet-DEFAULT to-cyan-500 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

// ── Spinner ──
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('w-5 h-5 animate-spin text-violet-DEFAULT', className)} />
}

// ── Toast (simple) ──
let toastTimeout: NodeJS.Timeout
export function showToast(message: string, duration = 3000) {
  let t = document.getElementById('global-toast')
  if (!t) {
    t = document.createElement('div')
    t.id = 'global-toast'
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:rgba(43,69,72,.12);border:1px solid rgba(66,127,131,.3);border-radius:12px;padding:11px 20px;font-size:13px;color:#172326;z-index:9999;transition:transform .3s ease;pointer-events:none;white-space:nowrap'
    document.body.appendChild(t)
  }
  t.textContent = message
  t.style.transform = 'translateX(-50%) translateY(0)'
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    if (t) t.style.transform = 'translateX(-50%) translateY(80px)'
  }, duration)
}

// ── Select ──
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-mono text-text-2 uppercase tracking-wider">{label}</label>}
      <select
        className={cn(
          'w-full bg-surface border border-surface-2 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all',
          'focus:border-violet-DEFAULT focus:ring-2 focus:ring-violet-dim',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-surface">{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

// ── Step Indicator ──
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={cn(
            'flex items-center gap-2 text-xs font-mono',
          )}>
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all',
              i < current && 'bg-green-500 border-green-500 text-white',
              i === current && 'bg-violet-DEFAULT border-violet-DEFAULT text-white',
              i > current && 'bg-surface border-surface-2 text-text-3',
            )}>
              {i < current ? '✓' : i + 1}
            </div>
            {i === current && (
              <span className="text-text-2 transition-colors ml-1">
                {step}
              </span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              'flex-1 h-px mx-2 min-w-[20px] transition-colors',
              i < current ? 'bg-green-500' : 'bg-surface-2'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Code Block ──
export function CodeBlock({ code, language = 'bash', onCopy }: { code: string; language?: string; onCopy?: () => void }) {
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      showToast('✓ Copied to clipboard!')
      onCopy?.()
    })
  }
  return (
    <div className="relative bg-bg-2 border border-surface-2 rounded-xl p-4 font-mono text-sm overflow-x-auto">
      <button
        onClick={copy}
        className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-surface-2 border border-surface-2 rounded-md text-xs text-text-2 hover:border-violet-DEFAULT hover:text-violet-3 transition-all"
      >
        Copy
      </button>
      <code className="text-violet-3 text-xs leading-relaxed pr-14 block whitespace-pre-wrap">{code}</code>
    </div>
  )
}
