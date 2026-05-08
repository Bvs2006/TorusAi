// app/(app)/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProgressBar } from '@/components/ui'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { Plus, Zap, ArrowRight, Trophy, Flame, Clock, Layers, Sparkles, Users, FolderOpen, FileText, Briefcase, Building } from 'lucide-react'

const getPhaseProgress = (project: any) => {
  const phases = project.phases || []
  if (!phases.length) return 0
  return Math.round((phases.filter((p: any) => p.status === 'done').length / phases.length) * 100)
}

export default async function DashboardPage({ searchParams }: { searchParams: { tab?: string } }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (!session) redirect('/login')

  let uid: string
  try {
    const decoded = await adminAuth.verifySessionCookie(session!, true)
    uid = decoded.uid
  } catch { redirect('/login') as never }

  const tab = searchParams.tab

  const profileSnap = await adminDb.collection('profiles').doc(uid!).get()
  const profile = profileSnap.exists ? profileSnap.data() : {}
  const isOrg = profile?.account_type === 'organisation'

  let projects: any[] = []
  let allPhases: any[] = []
  let org: any = null
  let orgMembers: any[] = []
  let clientPortals: any[] = []
  let proposals: any[] = []

  // Fetch projects
  const projectsSnap = await adminDb.collection('projects')
    .where('user_id', '==', uid!)
    .limit(tab === 'recent' ? 50 : 10)
    .get()
  projects = projectsSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  if (isOrg) {
    const orgSnap = await adminDb.collection('organisations').where('owner_id', '==', uid!).limit(1).get()
    if (!orgSnap.empty) {
      org = { id: orgSnap.docs[0].id, ...orgSnap.docs[0].data() }
    } else {
      const newOrgRef = await adminDb.collection('organisations').add({
        name: profile?.company_details || `${profile?.username || 'User'}'s Team`,
        owner_id: uid!, created_at: new Date().toISOString()
      })
      org = { id: newOrgRef.id }
      await adminDb.collection('org_members').add({ org_id: newOrgRef.id, user_id: uid!, role: 'owner' })
    }
    if (org) {
      const [mSnap, pSnap, prSnap] = await Promise.all([
        adminDb.collection('org_members').where('org_id', '==', org.id).get(),
        adminDb.collection('client_portals').where('org_id', '==', org.id).get(),
        adminDb.collection('proposals').where('org_id', '==', org.id).get(),
      ])
      orgMembers = mSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      clientPortals = pSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      proposals = prSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    }
  }

  const username = profile?.username || 'User'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (tab === 'recent') {
    return renderRecentProjects({ projects })
  }

  if (isOrg) {
    return renderOrganisationDashboard({ greeting, username, projects, org, orgMembers, clientPortals, proposals, profile })
  } else {
    return renderDeveloperDashboard({ greeting, username, projects, allPhases, profile })
  }
}

function renderRecentProjects({ projects }: { projects: any[] }) {
  return (
    <div style={{ padding: '42px', maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '460px', height: '460px', borderRadius: '50%', background: 'linear-gradient(145deg, rgba(255,255,255,.3), rgba(66,127,131,.08))', border: '1px solid rgba(43,69,72,.08)', pointerEvents: 'none', zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#172326', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock color="#427f83" size={28} /> Recent Projects
            </h1>
            <p style={{ color: '#607276', fontSize: '14px' }}>All your recent builds and AI-planned architectures.</p>
          </div>
          <Link href="/planner" style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
            background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '999px',
            color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px',
            boxShadow: '0 8px 24px rgba(66,127,131,.3)'
          }}>
            <Plus size={16} /> New Project
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects?.map(project => {
            const progress = getPhaseProgress(project)
            return (
              <Link key={project.id} href={`/planner/prompts?project=${project.id}`} style={{
                background: 'rgba(255,255,255,.54)', backdropFilter: 'blur(16px)', border: '1px solid rgba(38,69,72,.1)',
                borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column',
                transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden'
              }} className="glass-card telemetry-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', background: 'rgba(66,127,131,.1)', border: '1px solid rgba(66,127,131,.2)',
                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    boxShadow: 'inset 0 0 10px rgba(66,127,131,.1)'
                  }}>
                    {project.platform === 'mobile' ? '📱' : project.platform === 'api' ? '⚡' : '🌐'}
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: progress === 100 ? '#10b981' : '#06b6d4', background: progress === 100 ? 'rgba(16,185,129,.1)' : 'rgba(6,182,212,.1)', padding: '4px 10px', borderRadius: '20px', border: `1px solid ${progress === 100 ? 'rgba(16,185,129,.2)' : 'rgba(6,182,212,.2)'}` }}>
                    {progress}% Done
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#172326', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</h3>
                <div style={{ fontSize: '12px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>
                  {project.stack?.frontend?.name || project.platform}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <ProgressBar value={progress} />
                </div>
              </Link>
            )
          })}
        </div>
        {(!projects || projects.length === 0) && (
           <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,.54)', borderRadius: '20px', border: '1px solid rgba(38,69,72,.1)' }}>
             <Sparkles size={32} color="#5aa0a4" style={{ margin: '0 auto 16px' }} />
             <div style={{ fontSize: '16px', fontWeight: 600, color: '#172326', marginBottom: '8px' }}>No projects yet</div>
             <p style={{ color: '#607276', fontSize: '14px' }}>Start your first project to see it here.</p>
           </div>
        )}
      </div>
      <style>{`
        .glass-card:hover {
          background: rgba(66,127,131,.15) !important;
          border-color: rgba(66,127,131,.28) !important;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(66,127,131,.2);
        }
      `}</style>
    </div>
  )
}

function renderOrganisationDashboard({ greeting, username, projects, org, orgMembers, clientPortals, proposals, profile }: any) {
  const activeProjects = projects.filter((p: any) => p.status === 'active').length

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-200px', right: 0, width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56,189,248,.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: '#06b6d4', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Organisation Workspace
            </div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#172326', margin: 0 }}>
              {org?.name || 'Your Team'}
            </h1>
            <p style={{ color: '#607276', fontSize: '14px', marginTop: '8px' }}>{greeting}, {username}. Here's what's happening.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/planner" style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', borderRadius: '12px',
              color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px',
              boxShadow: '0 8px 24px rgba(6,182,212,.3)', transition: 'transform 0.2s'
            }}>
              <Plus size={16} /> New Client Project
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Active Projects', value: activeProjects, sub: `${projects.length} total`, color: '#06b6d4', glow: 'rgba(6,182,212,.2)' },
            { label: 'Team Members', value: orgMembers.length, sub: 'in workspace', color: '#3b82f6', glow: 'rgba(59,130,246,.2)' },
            { label: 'Client Portals', value: clientPortals.length, sub: 'active links', color: '#10b981', glow: 'rgba(16,185,129,.2)' },
            { label: 'Proposals', value: proposals.length, sub: 'sent & drafted', color: '#8b5cf6', glow: 'rgba(139,92,246,.2)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,.54)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(38,69,72,.1)', borderTop: `2px solid ${stat.color}`,
              borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden',
              boxShadow: `0 10px 30px rgba(0,0,0,0.2)`
            }}>
              <div style={{ position: 'absolute', top: 0, left: '10%', width: '80%', height: '30px', background: `radial-gradient(ellipse at top, ${stat.glow}, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#607276', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#172326', textShadow: `0 0 20px ${stat.glow}` }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#8a9a9d', marginTop: '6px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,.54)', backdropFilter: 'blur(16px)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#172326' }}>
                <Briefcase color="#06b6d4" size={20} /> Client Projects
              </div>
              <Link href="/dashboard?tab=recent" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', fontFamily: 'DM Mono, monospace' }}>View all →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!projects?.length ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Building size={24} color="#8a9a9d" style={{ margin: '0 auto 12px' }} />
                  <div style={{ color: '#607276', fontSize: '14px' }}>No projects yet. Start planning for your clients!</div>
                </div>
              ) : (
                projects.slice(0, 3).map((project: any) => {
                  const progress = getPhaseProgress(project)
                  return (
                    <Link key={project.id} href={`/planner/prompts?project=${project.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                      background: 'rgba(255,255,255,.46)', border: '1px solid rgba(38,69,72,.07)',
                      borderRadius: '14px', textDecoration: 'none', transition: 'all 0.2s'
                    }} className="glass-row org-row">
                      <div style={{
                        width: '44px', height: '44px', background: 'rgba(6,182,212,.1)',
                        border: '1px solid rgba(6,182,212,.2)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                      }}>
                        {project.platform === 'mobile' ? '📱' : project.platform === 'api' ? '⚡' : '🌐'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#172326' }}>{project.name}</span>
                          <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: progress === 100 ? '#10b981' : '#3b82f6' }}>{progress}%</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>
                          {project.stack?.frontend?.name || project.platform} · Phase {(project.phases || []).filter((p: any) => p.status === 'done').length}/{(project.phases || []).length}
                        </div>
                        <ProgressBar value={progress} />
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(6,182,212,.1), rgba(59,130,246,.05))',
              backdropFilter: 'blur(16px)', border: '1px solid rgba(6,182,212,.2)',
              borderRadius: '20px', padding: '24px', boxShadow: '0 10px 40px rgba(6,182,212,.1)'
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#172326' }}>
                <Zap size={18} color="#06b6d4" /> Workspace Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { href: '#', icon: <Users size={18} color="#3b82f6" />, label: 'Invite Team', desc: 'Add members to workspace' },
                  { href: '#', icon: <FolderOpen size={18} color="#10b981" />, label: 'Client Portals', desc: 'Manage client access' },
                  { href: '#', icon: <FileText size={18} color="#8b5cf6" />, label: 'Proposals', desc: 'Draft a new proposal' }
                ].map(action => (
                  <div key={action.label} style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
                    background: 'rgba(255,255,255,.46)', border: '1px solid rgba(38,69,72,.1)',
                    borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer'
                  }} className="glass-row org-row" onClick={() => alert('Feature coming soon!')}>
                    <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(38,69,72,.1)', borderRadius: '8px' }}>
                      {action.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326' }}>{action.label}</div>
                      <div style={{ fontSize: '11px', color: '#607276', marginTop: '2px' }}>{action.desc}</div>
                    </div>
                    <ArrowRight size={14} color="#8a9a9d" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .org-row:hover {
          background: rgba(6,182,212,0.1) !important;
          border-color: rgba(6,182,212,0.3) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  )
}

function renderDeveloperDashboard({ greeting, username, projects, allPhases, profile }: any) {
  const totalProjects = projects?.length || 0
  const completedProjects = projects?.filter((p: any) => p.status === 'completed').length || 0
  const totalPhasesDone = allPhases?.filter((p: any) => p.status === 'done').length || 0
  const streak = profile?.streak_count || 0
  const badges = profile?.badges || []

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-200px', right: 0, width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,182,212,.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: '#06b6d4', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Workspace Overview
            </div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#172326', margin: 0 }}>
              {greeting}, {username} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(24,45,56,.1)', borderRadius: '12px', fontSize: '13px', color: '#607276', boxShadow: '0 12px 32px rgba(24,45,56,.08)' }}>
              <span style={{ color: '#172326', fontWeight: 700 }}>{projects?.filter((p: any) => p.status === 'active').length || 0}</span> Active Projects
            </div>
            <Link href="/planner" style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '12px',
              color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px',
              boxShadow: '0 8px 24px rgba(66,127,131,.3)', transition: 'transform 0.2s'
            }}>
              <Plus size={16} /> New Project
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Projects', value: totalProjects, sub: `${completedProjects} completed`, color: '#5aa0a4', glow: 'rgba(66,127,131,.2)' },
            { label: 'Phases Completed', value: totalPhasesDone, sub: 'across all projects', color: '#06b6d4', glow: 'rgba(6,182,212,.2)' },
            { label: 'Current Streak', value: `🔥 ${streak}`, sub: 'days consecutive', color: '#f97316', glow: 'rgba(249,115,22,.2)' },
            { label: 'Badges Earned', value: badges.length, sub: 'achievements unlocked', color: '#10b981', glow: 'rgba(16,185,129,.2)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,.54)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(38,69,72,.1)', borderTop: `2px solid ${stat.color}`,
              borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden',
              boxShadow: `0 10px 30px rgba(0,0,0,0.2)`
            }}>
              <div style={{ position: 'absolute', top: 0, left: '10%', width: '80%', height: '30px', background: `radial-gradient(ellipse at top, ${stat.glow}, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#607276', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#172326', textShadow: `0 0 20px ${stat.glow}` }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#8a9a9d', marginTop: '6px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,.54)', backdropFilter: 'blur(16px)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#172326' }}>
                <Layers color="#427f83" size={20} /> Active Projects
              </div>
              <Link href="/dashboard?tab=recent" style={{ fontSize: '12px', color: '#06b6d4', textDecoration: 'none', fontFamily: 'DM Mono, monospace' }}>View all →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!projects?.length ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Sparkles size={24} color="#8a9a9d" style={{ margin: '0 auto 12px' }} />
                  <div style={{ color: '#607276', fontSize: '14px' }}>No active projects. Time to build!</div>
                </div>
              ) : (
                projects.slice(0, 3).map((project: any) => {
                  const progress = getPhaseProgress(project)
                  return (
                    <Link key={project.id} href={`/planner/prompts?project=${project.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                      background: 'rgba(255,255,255,.46)', border: '1px solid rgba(38,69,72,.07)',
                      borderRadius: '14px', textDecoration: 'none', transition: 'all 0.2s'
                    }} className="glass-row">
                      <div style={{
                        width: '44px', height: '44px', background: 'rgba(66,127,131,.1)',
                        border: '1px solid rgba(66,127,131,.2)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                      }}>
                        {project.platform === 'mobile' ? '📱' : project.platform === 'api' ? '⚡' : '🌐'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#172326' }}>{project.name}</span>
                          <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: progress === 100 ? '#10b981' : '#06b6d4' }}>{progress}%</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>
                          {project.stack?.frontend?.name || project.platform} · Phase {(project.phases || []).filter((p: any) => p.status === 'done').length}/{(project.phases || []).length}
                        </div>
                        <ProgressBar value={progress} />
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(66,127,131,.1), rgba(6,182,212,.05))',
              backdropFilter: 'blur(16px)', border: '1px solid rgba(66,127,131,.2)',
              borderRadius: '20px', padding: '24px', boxShadow: '0 10px 40px rgba(66,127,131,.1)'
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#172326' }}>
                <Zap size={18} color="#83b9bd" /> Quick Tools
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { href: '/planner', icon: '✨', label: 'AI Build Planner', desc: 'Generate a new architecture' },
                  { href: '/error-fix', icon: '🔧', label: 'Error Fixer', desc: 'Debug terminal output instantly' },
                  { href: '/tools', icon: '⚡', label: 'Tool Directory', desc: 'Find the best AI coding agents' }
                ].map(action => (
                  <Link key={action.href} href={action.href} style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
                    background: 'rgba(255,255,255,.46)', border: '1px solid rgba(38,69,72,.1)',
                    borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s'
                  }} className="glass-row">
                    <div style={{ fontSize: '20px' }}>{action.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326' }}>{action.label}</div>
                      <div style={{ fontSize: '11px', color: '#607276', marginTop: '2px' }}>{action.desc}</div>
                    </div>
                    <ArrowRight size={14} color="#8a9a9d" />
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,.54)', backdropFilter: 'blur(16px)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#172326' }}>
                  <Trophy size={18} color="#fbbf24" /> Achievements
                </div>
                <Link href="/badges" style={{ fontSize: '12px', color: '#fbbf24', textDecoration: 'none', fontFamily: 'DM Mono, monospace' }}>View all →</Link>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {badges.length > 0 ? badges.slice(0, 4).map((b: any, i: number) => (
                  <span key={i} style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)', color: '#fbbf24',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <span>{b.emoji}</span> {b.name}
                  </span>
                )) : (
                  <div style={{ fontSize: '12px', color: '#8a9a9d', padding: '10px 0' }}>Complete your first milestone to unlock badges.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,.54)', backdropFilter: 'blur(16px)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#172326' }}>
              <Flame size={20} color="#f97316" /> Consistency Activity
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: '4px' }}>
            {Array.from({ length: 182 }).map((_, i) => {
              const intensity = Math.random()
              const colors = ['rgba(255,255,255,0.03)', 'rgba(249,115,22,0.2)', 'rgba(249,115,22,0.4)', 'rgba(249,115,22,0.6)', 'rgba(249,115,22,0.8)', '#f97316']
              const ci = intensity < 0.6 ? 0 : intensity < 0.75 ? 1 : intensity < 0.85 ? 2 : intensity < 0.92 ? 3 : intensity < 0.98 ? 4 : 5
              return (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: '4px',
                  background: i >= 170 ? colors[Math.min(5, ci + 2)] : colors[ci],
                  transition: 'transform 0.2s', cursor: 'pointer'
                }} className="heatmap-cell" title="Activity block" />
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>
            <span>6 months ago</span>
            <span>Today</span>
          </div>
        </div>
        
      </div>
      
      <style>{`
        .glass-row:hover {
          background: rgba(66,127,131,.1) !important;
          border-color: rgba(66,127,131,.3) !important;
          transform: translateX(4px);
        }
        .heatmap-cell:hover {
          transform: scale(1.3);
          z-index: 10;
          box-shadow: 0 0 10px rgba(249,115,22,0.5);
        }
      `}</style>
    </div>
  )
}
