import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { FileText, Plus, FileEdit, Send, CheckCircle2, XCircle } from 'lucide-react'

export default async function ProposalsPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (!session) redirect('/login')

  let uid: string
  try { const d = await adminAuth.verifySessionCookie(session, true); uid = d.uid }
  catch { redirect('/login') as never; uid = '' }

  const profileSnap = await adminDb.collection('profiles').doc(uid).get()
  if (profileSnap.data()?.account_type !== 'organisation') redirect('/dashboard')

  const orgSnap = await adminDb.collection('organisations').where('owner_id', '==', uid).limit(1).get()
  const org = orgSnap.empty ? null : { id: orgSnap.docs[0].id, ...orgSnap.docs[0].data() }

  let proposals: any[] = []
  if (org) {
    const pSnap = await adminDb.collection('proposals').where('org_id', '==', org.id).get()
    proposals = pSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileEdit size={14} />
      case 'sent': return <Send size={14} />
      case 'accepted': return <CheckCircle2 size={14} />
      case 'rejected': return <XCircle size={14} />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return { bg: 'rgba(255,255,255,.06)', color: '#9d93c4' }
      case 'sent': return { bg: 'rgba(59,130,246,.1)', color: '#60a5fa' }
      case 'accepted': return { bg: 'rgba(16,185,129,.1)', color: '#10b981' }
      case 'rejected': return { bg: 'rgba(244,63,94,.1)', color: '#fb7185' }
      default: return { bg: 'transparent', color: '#fff' }
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#ede9ff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText color="#8b5cf6" /> Proposals
          </h1>
          <p style={{ color: '#9d93c4', fontSize: '14px' }}>Draft and track project proposals for your clients.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Draft Proposal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {proposals.map(proposal => {
          const s = getStatusColor(proposal.status)
          return (
            <div key={proposal.id} style={{ background: 'rgba(26,23,48,.5)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Mono, monospace', display: 'flex', alignItems: 'center', gap: '6px', background: s.bg, color: s.color }}>
                  {getStatusIcon(proposal.status)} {(proposal.status || 'draft').toUpperCase()}
                </span>
                <span style={{ fontSize: '12px', color: '#5c5480', fontFamily: 'DM Mono, monospace' }}>
                  {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ede9ff', marginBottom: '4px' }}>{proposal.client_name}</h3>
              <div style={{ fontSize: '13px', color: '#9d93c4', marginBottom: '20px' }}>Project: <span style={{ color: '#ede9ff', fontWeight: 500 }}>{proposal.project_id || 'General Proposal'}</span></div>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#9d93c4' }}>Tone: <span style={{ color: '#a78bfa', textTransform: 'capitalize' }}>{proposal.tone || 'professional'}</span></span>
                <button style={{ background: 'transparent', border: 'none', color: '#8b5cf6', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>View →</button>
              </div>
            </div>
          )
        })}
      </div>

      {proposals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(26,23,48,.4)', borderRadius: '20px', border: '1px solid rgba(255,255,255,.05)' }}>
          <FileText size={32} color="#8b5cf6" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#ede9ff', marginBottom: '8px' }}>No proposals drafted</div>
          <p style={{ color: '#9d93c4', fontSize: '14px' }}>Draft your first AI-powered proposal to win a client.</p>
        </div>
      )}
    </div>
  )
}
