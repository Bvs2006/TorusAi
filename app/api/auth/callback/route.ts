// app/api/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
      
      // Create profile if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          username: user.email?.split('@')[0],
          streak_count: 0,
          badges: [],
        }, { onConflict: 'id', ignoreDuplicates: true })
      }
    } catch (error) {
      console.error('Auth callback error:', error)
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
