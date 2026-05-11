'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Sparkles, Users, User, ArrowRight, Zap, ChevronLeft, Building2, LayoutGrid, CheckCircle2 } from 'lucide-react'
import { StepIndicator, showToast } from '@/components/ui'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/utils/firebase/client'

export default function TeamGuidePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [teamName, setTeamName] = useState('')
  const [teamSize, setTeamSize] = useState(3)
  const [generating, setGenerating] = useState(false)
  const [roles, setRoles] = useState<any[] | null>(null)
  const storageKey = projectId ? `torus-team-guide:${projectId}` : ''

  useEffect(() => {
    if (!projectId) { router.push('/planner'); return }
    
    getDoc(doc(db as any, 'projects', projectId)).then(async (s) => {
      if (s.exists()) {
        setProject({ id: s.id, ...s.data() as any })
      }
      setLoading(false)
    })

    try {
      const saved = sessionStorage.getItem(`torus-team-guide:${projectId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.roles)) setRoles(parsed.roles)
        if (parsed.teamName) setTeamName(parsed.teamName)
        if (parsed.teamSize) setTeamSize(parsed.teamSize)
      }
    } catch {
      sessionStorage.removeItem(`torus-team-guide:${projectId}`)
    }
  }, [projectId, router])

  async function handleGenerateRoles(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim()) {
      showToast('Please enter a team name.')
      return
    }
    
    setGenerating(true)
    try {
      // Fetch features for context so generated roles match the actual project plan.
      const nodesSnap = await getDocs(query(collection(db as any, 'features'), where('project_id', '==', projectId)))
      const features = nodesSnap.docs
        .map(d => d.data())
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((feature: any) => feature.name || feature.title)
        .filter(Boolean)

      const res = await fetch('/api/ai/team-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIdea: project.idea,
          features: features,
          teamName: teamName,
          teamSize: teamSize,
          platform: project.platform,
          stack: project.stack || {}
        })
      })
      
      const data = await res.json()
      if (data.roles) {
        setRoles(data.roles)
        if (storageKey) {
          sessionStorage.setItem(storageKey, JSON.stringify({
            roles: data.roles,
            teamName,
            teamSize,
            generatedAt: Date.now(),
          }))
        }
        showToast('✓ Team roles generated!')
      } else {
        throw new Error('Failed to generate roles')
      }
    } catch (err) {
      console.error(err)
      showToast('❌ Error generating roles. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return (
    <div style={{ padding: '40px', color: '#8a9a9d', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(66,127,131,.2)', borderTopColor: '#427f83', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading project data...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
          <ChevronLeft size={16} /> Back to Architecture
        </button>

        <StepIndicator steps={['Idea', 'Features', 'Architecture', 'Prompts', 'Blueprint', 'Deploy']} current={2} />

        <div style={{ marginTop: '32px', display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Input Section */}
          <div style={{ flex: '1 1 400px', background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '40px', boxShadow: 'var(--card-shadow)', backdropFilter: 'var(--glass-blur)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <Users size={22} />
              </div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>Team Guide Generator</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              Define your team structure to generate role-specific workflows for <strong>{project?.name}</strong>. Each teammate gets clear ownership, tasks, tools, and a step-by-step development guide.
            </p>

            <div style={{ display: 'grid', gap: '10px', marginBottom: '28px' }}>
              {[
                { label: 'Ownership', text: 'Each role gets a clear area of responsibility.' },
                { label: 'Parallel work', text: 'Teammates can build different parts without blocking each other.' },
                { label: 'Confidence checks', text: 'Role guides include goals, prompts, sub-steps, and definition of done.' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <CheckCircle2 size={16} color="var(--accent-teal)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-heading)' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleGenerateRoles}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Team Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g. Alpha Squad, Dev Mavericks..."
                    style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 14px 14px 48px', fontSize: '15px', color: 'var(--text)', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Team Size ({teamSize} Members)</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={teamSize}
                  onChange={e => setTeamSize(parseInt(e.target.value))}
                  style={{ width: '100%', height: '6px', background: 'var(--bg-3)', borderRadius: '3px', cursor: 'pointer', appearance: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                  <span>1 Member</span>
                  <span>4 Members</span>
                  <span>8 Members</span>
                </div>
              </div>

              <button type="submit" disabled={generating} style={{
                width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--primary), #2563eb)',
                border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 800,
                cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 8px 24px rgba(37,99,235,.2)', transition: 'all 0.2s'
              }}>
                {generating ? <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Zap size={18} />}
                {generating ? 'Architecting Team...' : 'Generate Role-Wise Guides'}
              </button>
            </form>
          </div>

          {/* Roles Result Section */}
          <div style={{ flex: '1.2 1 400px' }}>
            {!roles ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', border: '2px dashed var(--border-subtle)', borderRadius: '24px', textAlign: 'center' }}>
                <LayoutGrid size={48} color="var(--border-subtle)" style={{ marginBottom: '16px' }} />
                <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '18px', fontWeight: 700 }}>Roles will appear here</h3>
                <p style={{ color: 'var(--text-subtle)', fontSize: '13px', maxWidth: '320px', marginTop: '8px', lineHeight: 1.6 }}>Fill out the team details to generate specific responsibilities, recommended tools, development tasks, and role-wise guides.</p>
              </div>
            ) : (
              <div style={{ animation: 'fadeUp 0.5s ease-out' }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                  <Sparkles size={18} color="#f59e0b" /> Roles for {teamName}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  {roles.map((role, idx) => (
                    <div key={idx} style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateX(6px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                        <div style={{ width: '44px', height: '44px', background: 'rgba(66,127,131,.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-heading)' }}>{role.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '4px' }}>{role.focus}</div>
                        </div>
                        </div>
                        <button 
                          onClick={() => router.push(`/planner/architecture/team-guide/role?project=${projectId}&role=${encodeURIComponent(role.title)}`)}
                          style={{ background: 'rgba(59,130,246,.08)', border: 'none', color: '#3b82f6', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                        >
                          Open Guide <ArrowRight size={14} />
                        </button>
                      </div>

                      {Array.isArray(role.tasks) && role.tasks.length > 0 && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '10px' }}>Owned tasks</div>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            {role.tasks.slice(0, 4).map((task: string, taskIdx: number) => (
                              <div key={taskIdx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                                <span style={{ color: 'var(--accent-teal)', fontWeight: 800 }}>{taskIdx + 1}.</span>
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {Array.isArray(role.tools) && role.tools.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                          {role.tools.map((tool: string) => (
                            <span key={tool} style={{ fontSize: '11px', color: 'var(--text-heading)', background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '999px', padding: '5px 9px' }}>
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.15)', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={20} color="#10b981" />
                  <div style={{ fontSize: '13px', color: 'var(--success)' }}>
                    <strong>Team structure finalized.</strong> Ask every teammate to open their role guide, complete each phase, and share blockers at the end of the day.
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; background: #3b82f6; border: 3px solid #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  )
}
