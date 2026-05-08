import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { Users, Mail, Shield, MoreVertical } from 'lucide-react'

export default async function TeamPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (!session) redirect('/login')

  let uid: string
  try { const d = await adminAuth.verifySessionCookie(session, true); uid = d.uid }
  catch { redirect('/login') as never; uid = '' }

  const profileSnap = await adminDb.collection('profiles').doc(uid).get()
  const profile = profileSnap.data()
  if (profile?.account_type !== 'organisation') redirect('/dashboard')

  const orgSnap = await adminDb.collection('organisations').where('owner_id', '==', uid).limit(1).get()
  const org = orgSnap.empty ? null : { id: orgSnap.docs[0].id, ...orgSnap.docs[0].data() }

  let members: any[] = []
  if (org) {
    const mSnap = await adminDb.collection('org_members').where('org_id', '==', org.id).get()
    members = mSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#ede9ff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users color="#3b82f6" /> Team Members
          </h1>
          <p style={{ color: '#9d93c4', fontSize: '14px' }}>Manage access to {(org as any)?.name || 'your organisation'}.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={16} /> Invite Member
        </button>
      </div>

      <div style={{ background: 'rgba(26,23,48,.5)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              {['User', 'Role', 'Joined', ''].map(h => (
                <th key={h} style={{ padding: '16px 24px', fontSize: '11px', color: '#5c5480', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                      {(member.user_id?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: '#ede9ff', fontWeight: 600, fontSize: '14px' }}>{member.user_id}</div>
                      <div style={{ color: '#5c5480', fontSize: '12px', marginTop: '2px' }}>{member.user_id === uid ? 'You' : 'Member'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Mono, monospace', background: member.role === 'owner' ? 'rgba(139,92,246,.1)' : 'rgba(59,130,246,.1)', color: member.role === 'owner' ? '#a78bfa' : '#60a5fa' }}>
                    {member.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: '#9d93c4', fontSize: '13px' }}>
                  {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#5c5480' }}><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#5c5480' }}>No members found.</div>
        )}
      </div>
    </div>
  )
}
