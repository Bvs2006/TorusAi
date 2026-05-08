'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Code2, Building2, ArrowRight } from 'lucide-react'
import { showToast } from '@/components/ui'

const supabase = createClient()

export default function OnboardingPage() {
  const router = useRouter()
  const [type, setType] = useState<'developer' | 'organisation' | null>(null)
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (!type) return
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          account_type: type,
          company_details: type === 'organisation' ? details : null
        })
        .eq('id', user.id)

      if (error) throw error

      showToast('Welcome to Torus AI!')
      window.location.href = '/dashboard'
      
    } catch (err: any) {
      showToast(err.message || 'Error updating profile')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          Welcome to Torus AI
        </h1>
        <p style={{ color: '#607276', fontSize: '15px', marginBottom: '40px' }}>
          How will you be using Torus AI?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {/* Developer Option */}
          <div 
            onClick={() => setType('developer')}
            style={{
              background: type === 'developer' ? 'rgba(66,127,131,.15)' : 'rgba(255,255,255,.54)',
              border: `2px solid ${type === 'developer' ? '#427f83' : 'rgba(38,69,72,.1)'}`,
              borderRadius: '16px', padding: '30px 20px', cursor: 'pointer',
              transition: 'all 0.2s', transform: type === 'developer' ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            <div style={{ width: '50px', height: '50px', background: 'rgba(66,127,131,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#83b9bd' }}>
              <Code2 size={24} />
            </div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Developer</h3>
            <p style={{ color: '#607276', fontSize: '13px', lineHeight: '1.5' }}>
              I am an individual developer building projects.
            </p>
          </div>

          {/* Organisation Option */}
          <div 
            onClick={() => setType('organisation')}
            style={{
              background: type === 'organisation' ? 'rgba(6,182,212,.15)' : 'rgba(255,255,255,.54)',
              border: `2px solid ${type === 'organisation' ? '#06b6d4' : 'rgba(38,69,72,.1)'}`,
              borderRadius: '16px', padding: '30px 20px', cursor: 'pointer',
              transition: 'all 0.2s', transform: type === 'organisation' ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            <div style={{ width: '50px', height: '50px', background: 'rgba(6,182,212,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#67e8f9' }}>
              <Building2 size={24} />
            </div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Organisation</h3>
            <p style={{ color: '#607276', fontSize: '13px', lineHeight: '1.5' }}>
              We are a team or startup building products together.
            </p>
          </div>
        </div>

        {type === 'organisation' && (
          <div style={{ marginBottom: '30px', animation: 'fadeIn 0.3s ease' }}>
            <input 
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="What is your Company Name?"
              style={{
                width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.14)',
                borderRadius: '10px', padding: '12px 16px', color: '#172326', fontSize: '14px',
                outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s'
              }}
              onFocus={e => (e.target.style.borderColor = '#06b6d4')}
              onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.14)')}
            />
          </div>
        )}

        <button 
          onClick={handleComplete} 
          disabled={!type || (type === 'organisation' && !details.trim()) || loading}
          style={{
            padding: '14px 40px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', border: 'none', borderRadius: '12px',
            color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800,
            cursor: (!type || (type === 'organisation' && !details.trim()) || loading) ? 'not-allowed' : 'pointer',
            opacity: (!type || (type === 'organisation' && !details.trim()) || loading) ? 0.5 : 1,
            display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
            boxShadow: (!type || (type === 'organisation' && !details.trim()) || loading) ? 'none' : '0 8px 32px rgba(66,127,131,.28)'
          }}
        >
          {loading ? 'Saving...' : 'Continue to Dashboard'} <ArrowRight size={18} />
        </button>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  )
}
