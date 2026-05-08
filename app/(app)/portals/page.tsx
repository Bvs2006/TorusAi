import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FolderOpen, Plus, ExternalLink, Link as LinkIcon, MoreVertical } from 'lucide-react'

export default async function PortalsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('account_type').eq('id', session.user.id).single()
  if (profile?.account_type !== 'organisation') redirect('/dashboard')

  const { data: org } = await supabase.from('organisations').select('*').eq('owner_id', session.user.id).single()
  
  let portals: any[] = []
  if (org) {
    const { data } = await supabase
      .from('client_portals')
      .select('*, projects(name)')
      .eq('org_id', org.id)
      .order('created_at', { ascending: false })
    portals = data || []
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#172326', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FolderOpen color="#10b981" /> Client Portals
          </h1>
          <p style={{ color: '#607276', fontSize: '14px' }}>Secure workspaces for your clients to view progress.</p>
        </div>
        <button style={{
          padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px',
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(16,185,129,.3)'
        }}>
          <Plus size={16} /> New Portal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {portals.map(portal => (
          <div key={portal.id} style={{
            background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.1)',
            borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <FolderOpen size={20} />
                </div>
                <div>
                  <div style={{ color: '#172326', fontWeight: 700, fontSize: '16px' }}>{portal.client_name}</div>
                  <div style={{ color: '#607276', fontSize: '12px', marginTop: '2px' }}>{portal.projects?.name || 'Unlinked Project'}</div>
                </div>
              </div>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8a9a9d' }}>
                <MoreVertical size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <span style={{ padding: '4px 8px', background: 'rgba(38,69,72,.1)', borderRadius: '6px', fontSize: '11px', color: '#607276', fontFamily: 'DM Mono, monospace' }}>
                {portal.access_level} access
              </span>
              <span style={{ padding: '4px 8px', background: portal.status === 'active' ? 'rgba(16,185,129,.1)' : 'rgba(38,69,72,.1)', color: portal.status === 'active' ? '#10b981' : '#607276', borderRadius: '6px', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                {portal.status}
              </span>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button style={{
                flex: 1, padding: '10px', background: 'rgba(9,8,15,.6)', border: '1px solid rgba(38,69,72,.1)',
                borderRadius: '8px', color: '#172326', fontSize: '13px', fontWeight: 600, display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'
              }}>
                <LinkIcon size={14} /> Copy Link
              </button>
              <button style={{
                padding: '10px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)',
                borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }} title="Open Portal">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {portals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,.54)', borderRadius: '20px', border: '1px solid rgba(38,69,72,.1)' }}>
          <FolderOpen size={32} color="#10b981" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#172326', marginBottom: '8px' }}>No client portals yet</div>
          <p style={{ color: '#607276', fontSize: '14px' }}>Create a secure workspace to share progress with your clients.</p>
        </div>
      )}
    </div>
  )
}
