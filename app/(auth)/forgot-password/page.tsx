'use client'
import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/utils/firebase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eef3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-1px', color: '#172326' }}>
              Torus<span style={{ color: '#5aa0a4' }}>AI</span>
            </div>
          </Link>
          <p style={{ color: '#607276', fontSize: '14px', marginTop: '8px' }}>Reset your password.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '16px', padding: '28px' }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: '8px', padding: '16px', marginBottom: '20px', color: '#10b981', fontSize: '14px' }}>
                Password reset link sent! Check your inbox for instructions to reset your password.
              </div>
              <Link href="/login" style={{ display: 'inline-block', width: '100%', padding: '12px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 800, textDecoration: 'none' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#607276', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  style={{ width: '100%', background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '10px', padding: '10px 14px', color: '#172326', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                  onFocus={e => (e.target.style.borderColor = '#427f83')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.12)')}
                />
              </div>

              {error && <div style={{ background: 'rgba(244,63,94,.1)', border: '1px solid rgba(244,63,94,.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f43f5e' }}>{error}</div>}

              <button type="submit" disabled={loading || !email} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 800, cursor: loading || !email ? 'not-allowed' : 'pointer', opacity: loading || !email ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/login" style={{ fontSize: '13px', color: '#607276', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
