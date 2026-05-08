import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { FolderOpen, Plus, ExternalLink, Link as LinkIcon, MoreVertical } from 'lucide-react'

export default async function PortalsPage() {
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

  let portals: any[] = []
  if (org) {
    const pSnap = await adminDb.collection('client_portals').where('org_id', '==', org.id).get()
    portals = pSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#ede9ff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FolderOpen color="#10b981" /> Client Portals
          </h1>
          <p style={{ color: '#9d93c4', fontSize: '14px' }}>Secure workspaces for your clients to view progress.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> New Portal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {portals.map(portal => (
          <div key={portal.id} style={{ background: 'rgba(26,23,48,.5)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><FolderOpen size={20} /></div>
                <div>
                  <div style={{ color: '#ede9ff', fontWeight: 700, fontSize: '16px' }}>{portal.client_name}</div>
                  <div style={{ color: '#9d93c4', fontSize: '12px', marginTop: '2px' }}>{portal.project_id || 'Unlinked Project'}</div>
                </div>
              </div>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#5c5480' }}><MoreVertical size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,.05)', borderRadius: '6px', fontSize: '11px', color: '#9d93c4', fontFamily: 'DM Mono, monospace' }}>{portal.access_level || 'view'} access</span>
              <span style={{ padding: '4px 8px', background: portal.status === 'active' ? 'rgba(16,185,129,.1)' : 'rgba(255,255,255,.05)', color: portal.status === 'active' ? '#10b981' : '#9d93c4', borderRadius: '6px', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>{portal.status || 'inactive'}</span>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '8px', color: '#ede9ff', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}><LinkIcon size={14} /> Copy Link</button>
              <button style={{ padding: '10px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ExternalLink size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {portals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(26,23,48,.4)', borderRadius: '20px', border: '1px solid rgba(255,255,255,.05)' }}>
          <FolderOpen size={32} color="#10b981" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#ede9ff', marginBottom: '8px' }}>No client portals yet</div>
          <p style={{ color: '#9d93c4', fontSize: '14px' }}>Create a secure workspace to share progress with your clients.</p>
        </div>
      )}
    </div>
  )
}
