// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/utils/firebase/admin'

const SESSION_COOKIE = 'fb_session'
const EXPIRY = 60 * 60 * 24 * 5 * 1000 // 5 days

export async function POST(req: NextRequest) {
  try {
    const { token, username } = await req.json()
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid
    const email = decoded.email

    // Ensure profile document exists securely on the server
    const { adminDb } = await import('@/utils/firebase/admin')
    const profileRef = adminDb.collection('profiles').doc(uid)
    const profileSnap = await profileRef.get()
    if (!profileSnap.exists) {
      await profileRef.set({
        username: username || decoded.name || email?.split('@')[0] || 'User',
        email: email || '',
        full_name: decoded.name || username || '',
        account_type: 'developer',
        streak_count: 0,
        badges: [],
        created_at: new Date().toISOString()
      })
    }

    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn: EXPIRY })
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      maxAge: EXPIRY / 1000, path: '/', sameSite: 'lax',
    })
    return res
  } catch (err: any) {
    console.error('Session Error:', err)
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('fb_session', '', { maxAge: 0, path: '/' })
  return res
}
