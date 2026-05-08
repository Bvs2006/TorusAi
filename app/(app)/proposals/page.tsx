import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileText, Plus, FileEdit, Send, CheckCircle2, XCircle } from 'lucide-react'

export default async function ProposalsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('account_type').eq('id', session.user.id).single()
  if (profile?.account_type !== 'organisation') redirect('/dashboard')

  const { data: org } = await supabase.from('organisations').select('*').eq('owner_id', session.user.id).single()
  
  let proposals: any[] = []
  if (org) {
    const { data } = await supabase
      .from('proposals')
      .select('*, projects(name)')
      .eq('org_id', org.id)
      .order('created_at', { ascending: false })
    proposals = data || []
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'draft': return <FileEdit size={14} />
      case 'sent': return <Send size={14} />
      case 'accepted': return <CheckCircle2 size={14} />
      case 'rejected': return <XCircle size={14} />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return { bg: 'rgba(38,69,72,.1)', color: '#607276', border: 'rgba(38,69,72,.14)' }
      case 'sent': return { bg: 'rgba(59,130,246,.1)', color: '#60a5fa', border: 'rgba(59,130,246,.2)' }
      case 'accepted': return { bg: 'rgba(16,185,129,.1)', color: '#10b981', border: 'rgba(16,185,129,.2)' }
      case 'rejected': return { bg: 'rgba(244,63,94,.1)', color: '#fb7185', border: 'rgba(244,63,94,.2)' }
      default: return { bg: 'transparent', color: '#fff', border: 'transparent' }
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#172326', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText color="#8b5cf6" /> Proposals
          </h1>
          <p style={{ color: '#607276', fontSize: '14px' }}>Draft and track project proposals for your clients.</p>
        </div>
        <button style={{
          padding: '10px 20px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px',
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(139,92,246,.3)'
        }}>
          <Plus size={16} /> Draft Proposal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {proposals.map(proposal => {
          const statusStyle = getStatusColor(proposal.status)
          return (
            <div key={proposal.id} style={{
              background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.1)',
              borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column',
              transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer'
            }} className="proposal-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ 
                  padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Mono, monospace',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`
                }}>
                  {getStatusIcon(proposal.status)}
                  {proposal.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '12px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>
                  {new Date(proposal.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172326', marginBottom: '4px' }}>{proposal.client_name}</h3>
              <div style={{ fontSize: '13px', color: '#607276', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Project: <span style={{ color: '#172326', fontWeight: 500 }}>{proposal.projects?.name || 'General Proposal'}</span>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(38,69,72,.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#8a9a9d' }}>Tone: <span style={{ color: '#a78bfa', textTransform: 'capitalize' }}>{proposal.tone}</span></span>
                <button style={{ background: 'transparent', border: 'none', color: '#8b5cf6', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  View →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {proposals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,.54)', borderRadius: '20px', border: '1px solid rgba(38,69,72,.1)' }}>
          <FileText size={32} color="#8b5cf6" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#172326', marginBottom: '8px' }}>No proposals drafted</div>
          <p style={{ color: '#607276', fontSize: '14px' }}>Draft your first AI-powered proposal to win a client.</p>
        </div>
      )}

      <style>{`
        .proposal-card:hover {
          border-color: rgba(139,92,246,0.3) !important;
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  )
}
