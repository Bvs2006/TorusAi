'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/utils/firebase/client'
import { doc, setDoc } from 'firebase/firestore'
import { Code2 } from 'lucide-react'
import { showToast } from '@/components/ui'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function completeDeveloperSetup() {
      try {
        const user = auth.currentUser
        if (!user) {
          router.push('/login')
          return
        }

        await setDoc(doc(db, 'profiles', user.uid), {
          username: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email,
          full_name: user.displayName || user.email?.split('@')[0] || 'User',
          account_type: 'developer',
          company_details: null,
          streak_count: 0,
          badges: [],
          updated_at: new Date().toISOString(),
        }, { merge: true })

        showToast('Developer workspace ready')
        router.push('/dashboard')
      } catch (err: any) {
        showToast(err.message || 'Error setting up workspace')
        setLoading(false)
      }
    }

    completeDeveloperSetup()
  }, [router])

  return (
    <div style={{ minHeight: 'calc(100vh - 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="telemetry-card" style={{ width: '100%', maxWidth: '420px', textAlign: 'center', padding: '32px' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'linear-gradient(135deg, #0f766e, #0891b2 58%, #f97316)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Code2 size={26} />
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          Setting up your developer workspace
        </h1>
        <p style={{ color: '#526977', fontSize: '14px', lineHeight: 1.6 }}>
          {loading ? 'Preparing your dashboard...' : 'Something went wrong. Please try signing in again.'}
        </p>
      </div>
    </div>
  )
}
