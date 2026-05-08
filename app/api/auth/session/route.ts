// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/utils/firebase/admin'

const SESSION_COOKIE = 'fb_session'
const EXPIRY = 60 * 60 * 24 * 5 * 1000 // 5 days

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn: EXPIRY })
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      maxAge: EXPIRY / 1000, path: '/', sameSite: 'lax',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('fb_session', '', { maxAge: 0, path: '/' })
  return res
}
