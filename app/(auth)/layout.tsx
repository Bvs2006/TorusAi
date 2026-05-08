// app/(auth)/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (session) redirect('/dashboard')
  return <>{children}</>
}
