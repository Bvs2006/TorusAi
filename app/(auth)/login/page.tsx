'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/utils/firebase/client'
import ThemeToggle from '@/components/ThemeToggle'
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react'

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
      if (!cred.user.emailVerified) {
        throw new Error('Please verify your email from the link we sent before signing in.')
      }
      const token = await cred.user.getIdToken()
      const res = await fetch('/api/auth/session', { method: 'POST', body: JSON.stringify({ token }), headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to initialize session')
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
      const res = await fetch('/api/auth/session', { method: 'POST', body: JSON.stringify({ token }), headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to initialize session')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#08080c] text-neutral-900 dark:text-white/90 selection:bg-purple-500/30 selection:text-white flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-600/20 dark:via-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 dark-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#08080c] flex items-center justify-center">
                <span className="w-2 rounded-full h-2 bg-gradient-to-r from-purple-400 to-cyan-400" />
              </div>
            </div>
            <span className="font-serif text-[28px] tracking-normal text-neutral-900 dark:text-white">Torus</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 font-bold">
              AI
            </span>
          </Link>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Welcome back. Enter your workspace.</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl">
          
          {/* Google Button */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 px-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white font-medium text-xs flex items-center justify-center gap-3 transition-all mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-white/[0.08]" />
            <span className="text-[11px] font-mono text-neutral-400 uppercase">or email</span>
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-white/[0.08]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2 font-medium">
                Work Email
              </label>
              <div className="relative flex items-center bg-neutral-50 dark:bg-[#141522] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-purple-500 transition-colors">
                <Mail size={15} className="text-neutral-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@domain.com"
                  className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] font-mono text-purple-600 dark:text-purple-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center bg-neutral-50 dark:bg-[#141522] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-purple-500 transition-colors">
                <Lock size={15} className="text-neutral-400 mr-2.5 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none font-sans"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-300 p-3 rounded-xl text-xs font-mono flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-40"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-neutral-400 border-t-white dark:border-t-black rounded-full animate-spin" />
              ) : (
                <>Sign In to Workspace <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-6 font-sans">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-purple-600 dark:text-purple-400 font-semibold underline underline-offset-4">
              Sign up free
            </Link>
          </p>

        </div>

      </div>

    </div>
  )
}
