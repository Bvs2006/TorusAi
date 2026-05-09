'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/utils/firebase/client'
import {
  Home, PlusSquare, Clock, Trophy, Settings, PanelLeftClose, PanelLeftOpen, LogOut, Users
} from 'lucide-react'

interface SidebarProps {
  user?: { username?: string; email?: string } | null
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [isCollapsed, setIsCollapsed] = useState(true)

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/planner', icon: PlusSquare, label: 'New Project' },
    { href: '/dashboard?tab=recent', icon: Clock, label: 'Recent Projects' },
    { href: '/team', icon: Users, label: 'Team Guide' },
    { href: '/badges', icon: Trophy, label: 'Badges' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  const handleSignOut = async () => {
    await signOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <aside style={{
      width: isCollapsed ? '64px' : '220px',
      background: 'rgba(255,255,255,.62)',
      borderRight: '1px solid rgba(24,45,56,.1)',
      backdropFilter: 'blur(26px) saturate(140%)',
      display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'flex-start',
      padding: '20px 0', flexShrink: 0,
      height: '100vh', overflowY: 'auto', position: 'sticky', top: 0,
      gap: '24px', transition: 'width 0.3s ease, align-items 0.3s ease'
    }}>
      
      {/* Top Logo / Workspace switcher */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'linear-gradient(145deg, #0f766e, #0891b2 58%, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: '18px', cursor: 'pointer', marginBottom: '8px',
        alignSelf: isCollapsed ? 'auto' : 'flex-start', marginLeft: isCollapsed ? '0' : '20px'
      }} title="Torus Workspace">
        T
      </div>

      {/* Navigation Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', padding: isCollapsed ? '0' : '0 12px', flex: 1 }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} title={isCollapsed ? item.label : undefined} style={{
              display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '12px',
              height: '40px', borderRadius: '12px', padding: isCollapsed ? '0' : '0 16px',
              color: active ? '#182d38' : '#526977',
              background: active ? 'rgba(255,255,255,.82)' : 'transparent',
              boxShadow: active ? '0 14px 36px rgba(24,45,56,.1), inset 0 1px 0 rgba(255,255,255,.84)' : 'none',
              transition: 'all 0.2s', textDecoration: 'none',
              width: isCollapsed ? '40px' : '100%', margin: isCollapsed ? '0 auto' : '0'
            }}
              onMouseOver={e => { if (!active) { e.currentTarget.style.color = '#182d38'; e.currentTarget.style.background = 'rgba(255,255,255,.56)' } }}
              onMouseOut={e => { if (!active) { e.currentTarget.style.color = '#526977'; e.currentTarget.style.background = 'transparent' } }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span style={{ fontSize: '13px', fontWeight: active ? 600 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>}
            </Link>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0' : '0 20px' }}>
        <Link href="/settings" title={isCollapsed ? "Profile" : undefined} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f766e, #0891b2 58%, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer',
            border: '2px solid transparent', transition: 'border 0.2s', flexShrink: 0
          }}
            onMouseOver={e => e.currentTarget.style.border = '2px solid #fff'}
            onMouseOut={e => e.currentTarget.style.border = '2px solid transparent'}
          >
            {((user?.username || user?.email || 'U')[0]).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#182d38', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.username || 'User'}</div>
              <div style={{ fontSize: '10px', color: '#81919a', whiteSpace: 'nowrap' }}>Personal · Free</div>
            </div>
          )}
        </Link>
        
        <button onClick={() => setIsCollapsed(!isCollapsed)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', color: '#81919a',
          display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '12px',
          padding: isCollapsed ? '0' : '0', width: '100%', transition: 'color 0.2s'
        }}
          onMouseOver={e => e.currentTarget.style.color = '#526977'}
          onMouseOut={e => e.currentTarget.style.color = '#81919a'}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /> <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Collapse</span></>}
        </button>

        <button onClick={handleSignOut} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', color: '#f43f5e',
          display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '12px',
          padding: isCollapsed ? '0' : '0', width: '100%', transition: 'color 0.2s'
        }}
          onMouseOver={e => e.currentTarget.style.color = '#ff6b81'}
          onMouseOut={e => e.currentTarget.style.color = '#f43f5e'}
          title="Sign Out"
        >
          <LogOut size={18} /> {!isCollapsed && <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Sign Out</span>}
        </button>
      </div>

    </aside>
  )
}
