'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/utils/firebase/client'
import {
  Home, PlusSquare, Clock, Trophy, Settings, PanelLeftClose, PanelLeftOpen, LogOut, Users
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
    { label: 'Recent', href: '/dashboard?tab=recent', icon: Clock },
    { label: 'Badges', href: '/badges', icon: Trophy },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  async function handleSignOut() {
    await firebaseSignOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <aside style={{
      width: isCollapsed ? '72px' : '260px',
      background: 'var(--surface-overlay)',
      backdropFilter: 'var(--glass-blur)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      zIndex: 40,
      flexShrink: 0
    }}>
      {/* Brand */}
      <div style={{ height: '72px', display: 'flex', alignItems: 'center', padding: isCollapsed ? '0' : '0 24px', justifyContent: isCollapsed ? 'center' : 'flex-start', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%' }} />
          </div>
          {!isCollapsed && <span>Torus<span style={{ color: 'var(--accent-teal)' }}>AI</span></span>}
        </div>
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              title={isCollapsed ? item.label : undefined} 
              className={`sidebar-nav-link ${active ? 'active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '12px',
                height: '44px', borderRadius: '12px', padding: isCollapsed ? '0' : '0 16px',
                color: active ? 'var(--text-heading)' : 'var(--text-muted)',
                background: active ? 'var(--surface-glass-hover)' : 'transparent',
                transition: 'all 0.2s', textDecoration: 'none',
                width: isCollapsed ? '44px' : '100%', margin: isCollapsed ? '0 auto' : '0',
                border: active ? '1px solid var(--border-subtle)' : '1px solid transparent'
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span style={{ fontSize: '13px', fontWeight: active ? 600 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>}
            </Link>
          )
        })}
      </div>

      {/* Footer / User */}
      <div style={{ padding: '20px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ThemeToggle collapsed={isCollapsed} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: isCollapsed ? '0' : '0 12px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0
          }}>
            {((user?.username || user?.email || 'U')[0]).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username || 'User'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-footer-btn"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '12px',
            padding: isCollapsed ? '0' : '0 12px', height: '40px', width: '100%', transition: 'all 0.2s',
            borderRadius: '10px'
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /> <span style={{ fontSize: '13px' }}>Collapse</span></>}
        </button>

        <button 
          onClick={handleSignOut}
          className="sidebar-footer-btn logout"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '12px',
            padding: isCollapsed ? '0' : '0 12px', height: '40px', width: '100%', transition: 'all 0.2s',
            borderRadius: '10px'
          }}
          title="Sign Out"
        >
          <LogOut size={18} /> {!isCollapsed && <span style={{ fontSize: '13px' }}>Sign Out</span>}
        </button>
      </div>

      <style>{`
        .sidebar-nav-link:hover {
          color: var(--text-heading) !important;
          background: var(--surface-glass-hover) !important;
        }
        .sidebar-footer-btn:hover {
          color: var(--text-heading) !important;
          background: var(--surface-glass-hover) !important;
        }
        .sidebar-footer-btn.logout:hover {
          color: var(--error) !important;
          background: rgba(244, 63, 94, 0.1) !important;
        }
      `}</style>
    </aside>
  )
}
