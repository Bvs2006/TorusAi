'use client'
// components/Navbar.tsx
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
const supabase = createClient()
import { LogOut, Bell, Settings, User } from 'lucide-react'

interface NavbarProps {
  user?: { email?: string; username?: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: '58px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 32px',
      background: 'rgba(246,249,249,0.72)', backdropFilter: 'blur(26px) saturate(150%)',
      borderBottom: '1px solid rgba(38,69,72,0.1)', boxShadow: '0 10px 34px rgba(43,70,74,0.08)'
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: '19px', letterSpacing: '-0.5px', textDecoration: 'none',
        color: '#172326'
      }}>
        Torus<span style={{ color: '#427f83' }}>AI</span>
      </Link>

      {/* Nav Links Removed - Now entirely in Sidebar */}
      <div style={{ flex: 1 }} />

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        {user ? (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #365f62, #83b9bd)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '12px', fontWeight: 700,
                fontFamily: 'Syne, sans-serif'
              }}
            >
              {(user.username || user.email || 'U')[0].toUpperCase()}
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: '42px', right: 0,
                background: 'rgba(255,255,255,.84)', border: '1px solid rgba(38,69,72,.14)',
                borderRadius: '16px', padding: '8px', minWidth: '180px',
                boxShadow: '0 24px 70px rgba(46,70,74,.16)', backdropFilter: 'blur(24px)', zIndex: 200
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(38,69,72,.08)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#172326' }}>{user.username || 'User'}</div>
                  <div style={{ fontSize: '11px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>{user.email}</div>
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
                      color: '#607276', textDecoration: 'none', fontSize: '13px',
                      transition: 'background 0.15s'
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(66,127,131,.1)')}
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
              padding: '6px 16px', border: '1px solid rgba(38,69,72,.12)',
              borderRadius: '999px', color: '#607276', textDecoration: 'none',
              fontSize: '13px', transition: 'all 0.15s'
            }}>Login</Link>
            <Link href="/signup" style={{
              padding: '7px 18px', background: 'linear-gradient(135deg,#365f62,#83b9bd)',
              borderRadius: '999px', color: '#fff', textDecoration: 'none',
              fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 700
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
