'use client'
import { auth } from '@/utils/firebase/client'
import { signOut as firebaseSignOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Settings, User, Sparkles } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  user?: { email?: string; username?: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  async function signOut() {
    await firebaseSignOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <nav className="fixed top-5 right-6 z-50 h-12 flex items-center gap-3 px-3 pl-4 rounded-full bg-white/90 dark:bg-[#0d0e17]/85 backdrop-blur-2xl border border-neutral-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all font-sans">
      
      {/* Brand Logo Link */}
      <Link href="/dashboard" className="flex items-center gap-2 group mr-1">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-white dark:bg-[#08080c] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          </div>
        </div>
        <span className="font-serif text-[17px] text-neutral-900 dark:text-white tracking-normal font-normal">Torus</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 px-1 py-0.2 rounded border border-purple-500/30 bg-purple-500/10">
          AI
        </span>
      </Link>

      <div className="w-[1px] h-4 bg-neutral-200 dark:bg-white/10" />

      {/* Quick Nav Links */}
      <div className="hidden sm:flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
        <Link href="/dashboard" className={`hover:text-black dark:hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-neutral-900 dark:text-white font-semibold' : ''}`}>
          Dashboard
        </Link>
        <Link href="/planner" className={`hover:text-black dark:hover:text-white transition-colors ${pathname.startsWith('/planner') ? 'text-neutral-900 dark:text-white font-semibold' : ''}`}>
          Planner
        </Link>
        <Link href="/tools" className={`hover:text-black dark:hover:text-white transition-colors ${pathname.startsWith('/tools') ? 'text-neutral-900 dark:text-white font-semibold' : ''}`}>
          Tools
        </Link>
        <Link href="/error-fix" className={`hover:text-black dark:hover:text-white transition-colors ${pathname.startsWith('/error-fix') ? 'text-neutral-900 dark:text-white font-semibold' : ''}`}>
          Error Fix
        </Link>
      </div>

      <div className="w-[1px] h-4 bg-neutral-200 dark:bg-white/10 hidden sm:block" />

      {/* Right Controls */}
      <div className="flex items-center gap-2 relative">
        <ThemeToggle collapsed={true} />
        
        {user ? (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center border border-white/20 shadow-sm hover:scale-105 transition-transform"
            >
              {(user.username || user.email || 'U')[0].toUpperCase()}
            </button>

            {menuOpen && (
              <div
                className="absolute top-12 right-0 bg-white dark:bg-[#0e101a] border border-neutral-200 dark:border-white/15 rounded-2xl p-2 min-w-[200px] shadow-2xl backdrop-blur-2xl z-50 animate-fade-up text-xs font-sans"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-3 border-b border-neutral-100 dark:border-white/[0.08] mb-1">
                  <div className="font-semibold text-neutral-900 dark:text-white truncate">{user.username || 'Builder'}</div>
                  <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate">{user.email}</div>
                </div>

                <Link
                  href="/badges"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Sparkles size={14} className="text-purple-500 dark:text-purple-400" />
                  <span>Streaks & Badges</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Settings size={14} className="text-neutral-400" />
                  <span>Settings</span>
                </Link>

                <div className="my-1 border-t border-neutral-100 dark:border-white/[0.06]" />

                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 py-1 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-xs font-semibold text-white bg-black dark:bg-white dark:text-black hover:opacity-90 px-3.5 py-1.5 rounded-full transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

    </nav>
  )
}
