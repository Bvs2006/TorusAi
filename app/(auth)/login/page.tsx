'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/utils/firebase/client'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const token = await cred.user.getIdToken()
      await fetch('/api/auth/session', { method: 'POST', body: JSON.stringify({ token }), headers: { 'Content-Type': 'application/json' } })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Login failed')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const token = await cred.user.getIdToken()
      await fetch('/api/auth/session', { method: 'POST', body: JSON.stringify({ token }), headers: { 'Content-Type': 'application/json' } })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', transition: 'background 0.3s ease' }}>
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <ThemeToggle />
      </div>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-1px', color: 'var(--text-heading)' }}>
              Torus<span style={{ color: 'var(--accent-teal)' }}>AI</span>
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Welcome back. Let's build.</p>
        </div>

        <div style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--card-shadow)', backdropFilter: 'var(--glass-blur)' }}>
          <button onClick={handleGoogle} style={{ width: '100%', padding: '11px', background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', transition: 'all 0.2s' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-teal)'; e.target.style.boxShadow = '0 0 0 3px var(--focus)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: '11px', color: 'var(--accent-teal)', textDecoration: 'none', fontFamily: 'DM Mono, monospace' }}>Forgot?</Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-teal)'; e.target.style.boxShadow = '0 0 0 3px var(--focus)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && <div style={{ background: 'rgba(244,63,94,.1)', border: '1px solid rgba(244,63,94,.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--error)' }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(66,127,131,0.2)' }}>
              {loading ? <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}<Link href="/signup" style={{ color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
