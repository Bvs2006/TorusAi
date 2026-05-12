// app/(app)/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { Plus, Zap, ArrowRight, Clock, Flame } from 'lucide-react'
import StreakWidget from '@/components/StreakWidget'
import ActiveProjectList from '@/components/ActiveProjectList'

const getPhaseProgress = (project: any) => {
  const phases = project.phases || []
  if (!phases.length) return 0
  return Math.round((phases.filter((p: any) => p.status === 'done').length / phases.length) * 100)
}

const QUICK_TOOLS = [
  { href: '/error-fix', icon: 'FX', label: 'Error Fixer', desc: 'Debug terminal output instantly' },
  { href: '/master-prompt', icon: 'MP', label: 'Master Prompt', desc: 'Turn rough ideas into structured AI prompts' },
  { href: '/tools', icon: 'AI', label: 'Tool Directory', desc: 'Find the best AI coding agents' },
  { href: '/mcp', icon: 'MC', label: 'Torus MCP', desc: 'Add Torus planning directly to your IDE' }
]

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

  let uid = ''
  try {
    const decoded = await adminAuth.verifySessionCookie(session!, true)
    uid = decoded.uid
  } catch { redirect('/login') as never }
  if (!uid) redirect('/login')

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

  return renderDeveloperDashboard({ greeting, username, projects, allPhases, profile, uid })
}

function renderRecentProjects({ projects }: { projects: any[] }) {
  return (
    <div style={{ padding: '42px', maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '460px', height: '460px', borderRadius: '50%', background: 'linear-gradient(145deg, rgba(255,255,255,.1), rgba(66,127,131,.04))', border: '1px solid var(--border-subtle)', pointerEvents: 'none', zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock color="var(--accent-teal)" size={28} /> Recent Projects
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>All your recent builds and AI-planned architectures.</p>
          </div>
          <Link href="/planner" style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', borderRadius: '999px',
            color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px',
            boxShadow: '0 8px 24px rgba(66,127,131,.3)'
          }}>
            <Plus size={16} /> New Project
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px', maxWidth: '500px' }}>
          <div style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-subtle)',
            borderRadius: '20px', padding: '24px', boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Zap size={18} color="var(--accent-cyan)" /> Quick Tools
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUICK_TOOLS.map(action => (
                <Link key={action.href} href={action.href} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
                  background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)',
                  borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s'
                }} className="glass-row">
                  <div style={{ fontSize: '20px' }}>{action.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>{action.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{action.desc}</div>
                  </div>
                  <ArrowRight size={14} color="var(--text-subtle)" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .glass-row:hover {
          background: var(--surface-glass-hover) !important;
          border-color: var(--accent-teal) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  )
}

function renderDeveloperDashboard({ greeting, username, projects, allPhases, profile, uid }: any) {
  const totalProjects = projects?.length || 0
  const completedProjects = projects?.filter((p: any) => p.status === 'completed').length || 0
  const activeProjects = projects?.filter((p: any) => p.status === 'active').length || 0
  const totalPhasesDone = allPhases?.filter((p: any) => p.status === 'done').length || 0

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-200px', right: 0, width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,182,212,.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--accent-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
              Workspace Overview
            </div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '38px', fontWeight: 800, color: 'var(--text-heading)', margin: 0, letterSpacing: '-1px' }}>
              {greeting}, {username} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '10px 16px', background: 'var(--surface-overlay)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-muted)', boxShadow: 'var(--card-shadow)' }}>
              <span style={{ color: 'var(--text-heading)', fontWeight: 700 }}>{activeProjects}</span> Active Projects
            </div>
            <Link href="/planner" style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', borderRadius: '12px',
              color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px',
              boxShadow: '0 8px 24px rgba(66,127,131,.3)', transition: 'transform 0.2s'
            }}>
              <Plus size={16} /> New Project
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Projects', value: totalProjects, sub: `${completedProjects} completed`, color: 'var(--accent-teal)', glow: 'rgba(66,127,131,.2)' },
            { label: 'Phases Completed', value: totalPhasesDone, sub: 'across all projects', color: 'var(--accent-cyan)', glow: 'rgba(6,182,212,.2)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--surface-glass)', backdropFilter: 'var(--glass-blur)',
              border: '1px solid var(--border-subtle)', borderTop: `2px solid ${stat.color}`,
              borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{ position: 'absolute', top: 0, left: '10%', width: '80%', height: '30px', background: `radial-gradient(ellipse at top, ${stat.glow}, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: 'var(--text-heading)', textShadow: `0 0 20px ${stat.glow}` }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '6px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800 }}>
            <Flame size={18} color="var(--accent-orange)" /> Streak Torus
          </div>
          <div style={{ maxWidth: '560px' }}>
            <StreakWidget userId={uid} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--surface-glass)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                <Clock color="var(--accent-teal)" size={20} /> Active Projects
              </div>
            </div>
            <ActiveProjectList projects={projects} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'var(--surface-glass)',
              backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-subtle)',
              borderRadius: '20px', padding: '24px', boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                <Zap size={18} color="var(--accent-cyan)" /> Quick Tools
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {QUICK_TOOLS.map(action => (
                  <Link key={action.href} href={action.href} style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
                    background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)',
                    borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s'
                  }} className="glass-row">
                    <div style={{ fontSize: '20px' }}>{action.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>{action.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{action.desc}</div>
                    </div>
                    <ArrowRight size={14} color="var(--text-subtle)" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .glass-row:hover {
          background: var(--surface-glass-hover) !important;
          border-color: var(--accent-teal) !important;
          transform: translateX(4px);
        }
        .active-project-card:hover {
          background: var(--surface-glass-hover) !important;
          border-color: var(--accent-teal) !important;
        }
      `}</style>
    </div>
  )
}
