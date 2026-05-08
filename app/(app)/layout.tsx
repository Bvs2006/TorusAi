// app/(app)/layout.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, account_type')
    .eq('id', session.user.id)
    .single()

  if (!profile?.account_type) {
    redirect('/onboarding')
  }

  const user = {
    email: session.user.email,
    username: profile?.username || session.user.email?.split('@')[0],
    account_type: profile?.account_type,
  }

  return (
    <div className="control-shell" style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar user={user} />
      <div style={{ display: 'flex' }}>
        <Sidebar user={user} />
        <main style={{ flex: 1, overflow: 'auto', minHeight: 'calc(100vh - 58px)', position: 'relative' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
