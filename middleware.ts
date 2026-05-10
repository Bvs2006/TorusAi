// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password', '/api/auth', '/tools']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => p === '/' ? pathname === '/' : pathname.startsWith(p))
  const session = request.cookies.get('fb_session')?.value

  if (!isPublic && pathname !== '/' && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
