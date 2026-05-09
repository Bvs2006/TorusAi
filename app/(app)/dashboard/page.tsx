// app/(app)/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { Plus, Zap, ArrowRight, Clock } from 'lucide-react'

const getPhaseProgress = (project: any) => {
  const phases = project.phases || []
  if (!phases.length) return 0
  return Math.round((phases.filter((p: any) => p.status === 'done').length / phases.length) * 100)
}

const getResumeStep = (project: any) => {
  // First check if current_step is explicitly set
  if (project.current_step) return project.current_step
  
  // Fallback: determine from phases
  const phases = project.phases || []
  if (!phases.length) return 'features' // default
  
  const stepMap: { [key: string]: string } = {
    'features': 'features',
    'architecture': 'architecture',
    'prompts': 'architecture', // prompts are part of architecture
    'blueprint': 'blueprint',
    'deploy': 'deploy'
  }
  
  // Find the highest completed phase and resume from next step
  let lastCompletedPhase = -1
  for (let i = 0; i < phases.length; i++) {
    if (phases[i].status === 'done') {
      lastCompletedPhase = i
    }
  }
  
  // If first phase (features) is done, move to architecture
  if (lastCompletedPhase >= 0 && phases[lastCompletedPhase].name?.toLowerCase().includes('feature')) {
    return 'architecture'
  }
  if (lastCompletedPhase >= 1 && phases[lastCompletedPhase].name?.toLowerCase().includes('architecture')) {
    return 'blueprint'
  }
  if (lastCompletedPhase >= 2 && phases[lastCompletedPhase].name?.toLowerCase().includes('blueprint')) {
    return 'deploy'
  }
  
  // Default to features if nothing is done
  return 'features'
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
  let projects: any[] = []
  let allPhases: any[] = []

  // Fetch projects
  const projectsSnap = await adminDb.collection('projects')
    .where('user_id', '==', uid!)
    .limit(tab === 'recent' ? 50 : 10)
    .get()
  projects = projectsSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  // Fetch phases for all projects to determine resume step
  const projectsWithPhases = await Promise.all(
    projects.map(async (proj: any) => {
      const phasesSnap = await adminDb.collection('phases')
        .where('project_id', '==', proj.id)
        .get()
      const phases = phasesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { ...proj, phases }
    })
  )
  projects = projectsWithPhases

  const username = profile?.username || 'User'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (tab === 'recent') {
    return renderRecentProjects({ projects })
  }

  return renderDeveloperDashboard({ greeting, username, projects, allPhases, profile })
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px', maxWidth: '500px' }}>
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
        </div>
      </div>
      <style>{`
        .glass-row:hover {
          background: rgba(66,127,131,.1) !important;
          border-color: rgba(66,127,131,.3) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  )
}

function renderDeveloperDashboard({ greeting, username, projects, allPhases, profile }: any) {
  const totalProjects = projects?.length || 0
  const completedProjects = projects?.filter((p: any) => p.status === 'completed').length || 0
  const activeProjects = projects?.filter((p: any) => p.status === 'active').length || 0
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Projects', value: totalProjects, sub: `${completedProjects} completed`, color: '#5aa0a4', glow: 'rgba(66,127,131,.2)' },
            { label: 'Phases Completed', value: totalPhasesDone, sub: 'across all projects', color: '#06b6d4', glow: 'rgba(6,182,212,.2)' },
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
                <Clock color="#427f83" size={20} /> Active Projects
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.filter((p: any) => p.status === 'active').length > 0 ? (
                projects.filter((p: any) => p.status === 'active').map((proj: any) => {
                  const resumeStep = getResumeStep(proj)
                  const stepPath = `/planner/${resumeStep}?project=${proj.id}`
                  return (
                    <Link key={proj.id} href={stepPath} style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '14px 16px', background: 'rgba(66,127,131,.08)', border: '1px solid rgba(66,127,131,.2)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(66,127,131,.15)'; e.currentTarget.style.borderColor = 'rgba(66,127,131,.4)' }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(66,127,131,.08)'; e.currentTarget.style.borderColor = 'rgba(66,127,131,.2)' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326' }}>{proj.name || 'Untitled Project'}</div>
                          <div style={{ fontSize: '11px', color: '#8a9a9d', marginTop: '3px' }}>{proj.idea?.substring(0, 50) || 'No description'}...</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#5aa0a4', fontWeight: 600, padding: '4px 10px', background: 'rgba(90,160,164,.1)', borderRadius: '6px' }}>{getPhaseProgress(proj)}%</div>
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ color: '#607276', fontSize: '14px' }}>No active projects. Time to build!</div>
                </div>
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
