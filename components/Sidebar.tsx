'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/utils/firebase/client'
import {
  Home, PlusSquare, Clock, Trophy, Settings, PanelLeftClose, PanelLeftOpen, LogOut, Compass, Terminal
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface SidebarProps {
  user?: { email?: string; username?: string } | null
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Planner', href: '/planner', icon: PlusSquare },
    { label: 'Tool Directory', href: '/tools', icon: Compass },
    { label: 'Error Fixer', href: '/error-fix', icon: Terminal },
    { label: 'Recent Builds', href: '/dashboard?tab=recent', icon: Clock },
    { label: 'Streaks & Badges', href: '/badges', icon: Trophy },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  async function handleSignOut() {
    await firebaseSignOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <aside
      className={`h-screen sticky top-0 z-40 bg-[#090a10] border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 select-none font-sans ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className={`h-20 flex items-center border-b border-white/[0.08] ${
          isCollapsed ? 'justify-center px-0' : 'justify-between px-6'
        }`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-[#08080c] flex items-center justify-center">
                <span className="w-2 rounded-full h-2 bg-gradient-to-r from-purple-400 to-cyan-400" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-[22px] tracking-normal text-white">Torus</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 px-1 py-0.2 rounded border border-purple-500/30 bg-purple-500/10">
                  AI
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  active
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={17} className={active ? 'text-black' : 'text-neutral-400'} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer / User Controls */}
      <div className="p-3 border-t border-white/[0.08] space-y-3">
        
        {/* User Card */}
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5 ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/20">
            {((user?.username || user?.email || 'U')[0]).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.username || 'Builder'}</div>
              <div className="text-[10px] font-mono text-neutral-400 truncate">{user?.email}</div>
            </div>
          )}
        </div>

        {/* Actions: Collapse & Sign Out */}
        <div className="flex items-center gap-1 justify-between pt-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-mono"
            title="Sign out"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>

      </div>

    </aside>
  )
}
