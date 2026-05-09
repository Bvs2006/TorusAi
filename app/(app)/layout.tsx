// app/(app)/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (!session) redirect('/login')

  let uid: string
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true)
    uid = decoded.uid
  } catch {
    redirect('/login')
  }

  const profileSnap = await adminDb.collection('profiles').doc(uid).get()
  const profile = profileSnap.exists ? profileSnap.data() : null

  const user = {
    uid,
    email: profile?.email || '',
    username: profile?.username || '',
  }

  return (
    <div className="control-shell" style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar user={user} />
      <div style={{ display: 'flex' }}>
        <Sidebar user={user} />
        <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh', position: 'relative' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
