'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/firebase/client'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '10px', padding: '10px 14px', color: '#172326', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#607276', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }

  async function createSession(token: string, username?: string) {
    const res = await fetch('/api/auth/session', { 
      method: 'POST', 
      body: JSON.stringify({ token, username }), 
      headers: { 'Content-Type': 'application/json' } 
    })
    const data = await res.json()
    if (!res.ok || data.error) throw new Error(data.error || 'Failed to initialize session')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(cred.user, { displayName: form.username })
      const token = await cred.user.getIdToken()
      await createSession(token, form.username)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 900)
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Sign up failed')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const token = await cred.user.getIdToken()
      await createSession(token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Google sign-up failed')
    }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#eef3f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#10b981' }}>Welcome to Torus AI!</h2>
        <p style={{ color: '#607276' }}>Opening your dashboard...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#eef3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-1px', color: '#172326' }}>Torus<span style={{ color: '#5aa0a4' }}>AI</span></div>
          </Link>
          <p style={{ color: '#607276', fontSize: '14px', marginTop: '8px' }}>Create your free account. No credit card needed.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '16px', padding: '28px' }}>
          <button onClick={handleGoogle} style={{ width: '100%', padding: '11px', background: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, color: '#172326' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(38,69,72,.12)' }} />
            <span style={{ fontSize: '12px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(38,69,72,.12)' }} />
          </div>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '14px' }}><label style={labelStyle}>Username</label>
              <input type="text" value={form.username} required minLength={3} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="coolbuilder" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#427f83')} onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.12)')} />
            </div>
            <div style={{ marginBottom: '14px' }}><label style={labelStyle}>Email</label>
              <input type="email" value={form.email} required onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#427f83')} onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.12)')} />
            </div>
            <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Password</label>
              <input type="password" value={form.password} required minLength={6} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="•••••••• (min 6 chars)" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#427f83')} onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.12)')} />
            </div>

            {error && <div style={{ background: 'rgba(244,63,94,.1)', border: '1px solid rgba(244,63,94,.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f43f5e' }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating account...</> : 'Create Free Account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#607276' }}>Already have an account?{' '}<Link href="/login" style={{ color: '#5aa0a4', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link></p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
