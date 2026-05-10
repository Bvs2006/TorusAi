'use client'
import { auth } from '@/utils/firebase/client'
import { signOut as firebaseSignOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
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
    <nav style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 100,
      height: '52px', display: 'flex', alignItems: 'center',
      gap: '12px', padding: '0 10px 0 20px', borderRadius: '999px',
      background: 'var(--surface-overlay)', backdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--border-subtle)', boxShadow: 'var(--card-shadow)'
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: '16px', letterSpacing: '-0.5px', textDecoration: 'none',
        color: 'var(--text-heading)', display: 'flex', alignItems: 'center'
      }}>
        Torus<span style={{ color: 'var(--accent-teal)' }}>AI</span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        <ThemeToggle collapsed={true} />
        
        {user ? (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan) 58%, var(--accent-orange))',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '13px', fontWeight: 700,
                fontFamily: 'Syne, sans-serif'
              }}
            >
              {(user.username || user.email || 'U')[0].toUpperCase()}
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: '48px', right: 0,
                background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)',
                borderRadius: '16px', padding: '8px', minWidth: '180px',
                boxShadow: 'var(--hover-shadow)', backdropFilter: 'var(--glass-blur)', zIndex: 200
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>{user.username || 'User'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace' }}>{user.email}</div>
                </div>
                {[
                  { icon: <User size={13} />, label: 'Profile', href: '/badges' },
                  { icon: <Settings size={13} />, label: 'Settings', href: '/settings' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="navbar-menu-item"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', borderRadius: '8px',
                      color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px',
                      transition: 'all 0.15s'
                    }}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
                <button
                  onClick={signOut}
                  className="navbar-menu-item logout"
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '8px',
                    color: 'var(--error)', background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '13px', textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link href="/login" style={{
              padding: '6px 16px', border: '1px solid var(--border-subtle)',
              borderRadius: '999px', color: 'var(--text-muted)', textDecoration: 'none',
              fontSize: '13px', transition: 'all 0.15s'
            }}>Login</Link>
            <Link href="/signup" style={{
              padding: '7px 18px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan) 58%, var(--accent-orange))',
              borderRadius: '999px', color: '#fff', textDecoration: 'none',
              fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 700
            }}>Get Started</Link>
          </>
        )}
      </div>

      <style>{`
        .navbar-menu-item:hover {
          background: var(--bg-2) !important;
          color: var(--text-heading) !important;
        }
        .navbar-menu-item.logout:hover {
          background: rgba(244, 63, 94, 0.08) !important;
          color: var(--error) !important;
        }
      `}</style>
    </nav>
  )
}
