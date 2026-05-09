'use client'
import { auth } from '@/utils/firebase/client'
import { signOut as firebaseSignOut } from 'firebase/auth'
// components/Navbar.tsx
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Settings, User } from 'lucide-react'

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

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 100,
      height: '52px', display: 'flex', alignItems: 'center',
      gap: '16px', padding: '0 10px 0 20px', borderRadius: '999px',
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(26px) saturate(150%)',
      border: '1px solid rgba(24,45,56,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: '16px', letterSpacing: '-0.5px', textDecoration: 'none',
        color: '#182d38', display: 'flex', alignItems: 'center'
      }}>
        Torus<span style={{ color: '#0f766e' }}>AI</span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {user ? (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #0f766e, #0891b2 58%, #f97316)',
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
                background: 'rgba(255,255,255,.95)', border: '1px solid rgba(24,45,56,.14)',
                borderRadius: '16px', padding: '8px', minWidth: '180px',
                boxShadow: '0 24px 70px rgba(24,45,56,.16)', backdropFilter: 'blur(24px)', zIndex: 200
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(24,45,56,.08)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#182d38' }}>{user.username || 'User'}</div>
                  <div style={{ fontSize: '11px', color: '#81919a', fontFamily: 'DM Mono, monospace' }}>{user.email}</div>
                </div>
                {[
                  { icon: <User size={13} />, label: 'Profile', href: '/badges' },
                  { icon: <Settings size={13} />, label: 'Settings', href: '/settings' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', borderRadius: '8px',
                      color: '#526977', textDecoration: 'none', fontSize: '13px',
                      transition: 'background 0.15s'
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(15,118,110,.1)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
                <button
                  onClick={signOut}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '8px',
                    color: '#f43f5e', background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '13px', textAlign: 'left',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(244,63,94,.08)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link href="/login" style={{
              padding: '6px 16px', border: '1px solid rgba(24,45,56,.12)',
              borderRadius: '999px', color: '#526977', textDecoration: 'none',
              fontSize: '13px', transition: 'all 0.15s'
            }}>Login</Link>
            <Link href="/signup" style={{
              padding: '7px 18px', background: 'linear-gradient(135deg,#0f766e,#0891b2 58%,#f97316)',
              borderRadius: '999px', color: '#fff', textDecoration: 'none',
              fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 700
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
