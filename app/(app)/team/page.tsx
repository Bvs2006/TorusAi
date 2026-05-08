import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Users, Mail, Shield, MoreVertical } from 'lucide-react'

export default async function TeamPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('account_type').eq('id', session.user.id).single()
  if (profile?.account_type !== 'organisation') {
    redirect('/dashboard')
  }

  // Get the org
  const { data: org } = await supabase.from('organisations').select('*').eq('owner_id', session.user.id).single()
  
  // Get members
  let members: any[] = []
  if (org) {
    const { data } = await supabase
      .from('org_members')
      .select('*, profiles(username, full_name, email)')
      .eq('org_id', org.id)
    members = data || []
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#172326', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users color="#3b82f6" /> Team Members
          </h1>
          <p style={{ color: '#607276', fontSize: '14px' }}>Manage access to {org?.name || 'your organisation'}.</p>
        </div>
        <button style={{
          padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px',
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(59,130,246,.3)'
        }}>
          <Mail size={16} /> Invite Member
        </button>
      </div>

      <div style={{ background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(38,69,72,.1)', background: 'rgba(255,255,255,.46)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#607276', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>User</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#607276', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>Role</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#607276', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>Joined</th>
              <th style={{ padding: '16px 24px', width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,.02)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                      {((member.profiles?.full_name || member.profiles?.username || 'U')[0]).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: '#172326', fontWeight: 600, fontSize: '14px' }}>{member.profiles?.full_name || member.profiles?.username || 'Unknown User'}</div>
                      <div style={{ color: '#8a9a9d', fontSize: '12px', marginTop: '2px' }}>{member.user_id === session.user.id ? 'You' : 'Member'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Mono, monospace',
                    background: member.role === 'owner' ? 'rgba(139,92,246,.1)' : 'rgba(59,130,246,.1)',
                    color: member.role === 'owner' ? '#a78bfa' : '#60a5fa',
                    border: `1px solid ${member.role === 'owner' ? 'rgba(139,92,246,.2)' : 'rgba(59,130,246,.2)'}`
                  }}>
                    {member.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: '#607276', fontSize: '13px' }}>
                  {new Date(member.joined_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 24px', color: '#8a9a9d' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8a9a9d' }}>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8a9a9d' }}>
            No members found.
          </div>
        )}
      </div>
    </div>
  )
}
