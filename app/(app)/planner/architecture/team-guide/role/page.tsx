'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Terminal, Sparkles, User, Zap, ChevronLeft, Copy, CheckCircle2, LayoutList, ExternalLink, Play } from 'lucide-react'
import { StepIndicator, showToast } from '@/components/ui'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/utils/firebase/client'

export default function RoleGuideDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const roleTitle = searchParams.get('role')
  const teamGuideHref = `/planner/architecture/team-guide?project=${projectId || ''}`
  const roadmapStorageKey = projectId && roleTitle ? `torus-role-guide:${projectId}:${roleTitle}` : ''
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [roadmap, setRoadmap] = useState<any[] | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  function readCachedRoadmap() {
    if (!roadmapStorageKey) return null
    try {
      const saved = sessionStorage.getItem(roadmapStorageKey) || localStorage.getItem(roadmapStorageKey)
      if (!saved) return null
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed.roadmap) && parsed.roadmap.length > 0 ? parsed.roadmap : null
    } catch {
      sessionStorage.removeItem(roadmapStorageKey)
      localStorage.removeItem(roadmapStorageKey)
      return null
    }
  }

  function saveCachedRoadmap(nextRoadmap: any[]) {
    if (!roadmapStorageKey || !Array.isArray(nextRoadmap) || nextRoadmap.length === 0) return
    const snapshot = {
      roadmap: nextRoadmap,
      generatedAt: Date.now(),
    }
    sessionStorage.setItem(roadmapStorageKey, JSON.stringify(snapshot))
    localStorage.setItem(roadmapStorageKey, JSON.stringify(snapshot))
  }

  useEffect(() => {
    if (!projectId || !roleTitle) { router.push('/planner'); return }
    
    getDoc(doc(db as any, 'projects', projectId)).then((s) => {
      if (s.exists()) {
        const data = { id: s.id, ...s.data() as any }
        setProject(data)
        const cachedRoadmap = readCachedRoadmap()
        if (cachedRoadmap) {
          setRoadmap(cachedRoadmap)
          setLoading(false)
          return
        }
        handleGenerateRoadmap(data)
      } else {
        setLoading(false)
      }
    })
  }, [projectId, roleTitle, router])

  async function handleGenerateRoadmap(projectData: any) {
    setGenerating(true)
    try {
      const featuresSnap = await getDocs(query(collection(db as any, 'features'), where('project_id', '==', projectId)))
      const features = featuresSnap.docs
        .map(d => d.data())
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((feature: any) => ({
          name: feature.name || feature.title,
          description: feature.description || '',
          priority: feature.priority || 'must',
          complexity: feature.complexity || 'medium',
        }))
        .filter((feature: any) => feature.name)
      let architectureTools: any[] = []
      try {
        const toolsRes = await fetch('/api/ai/recommend-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectIdea: projectData.idea,
            features,
            platform: projectData.platform,
            stack: projectData.stack || {},
          })
        })
        const toolsData = await toolsRes.json()
        if (Array.isArray(toolsData.tools)) architectureTools = toolsData.tools
      } catch (toolError) {
        console.warn('Could not load architecture tools for role guide:', toolError)
      }

      const res = await fetch('/api/ai/team-role-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectData.name,
          projectIdea: projectData.idea,
          platform: projectData.platform,
          features,
          architectureTools,
          role: roleTitle,
          stack: projectData.stack || {}
        })
      })
      const data = await res.json()
      if (data.roadmap) {
        setRoadmap(data.roadmap)
        saveCachedRoadmap(data.roadmap)
      }
    } catch (err) {
      console.error(err)
      showToast('Failed to generate roadmap.')
    } finally {
      setGenerating(false)
      setLoading(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    showToast('Prompt copied to clipboard!')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#8a9a9d' }}>
      <div style={{ width: '24px', height: '24px', border: '3px solid rgba(66,127,131,.2)', borderTopColor: '#427f83', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
      Architecting your role guide...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button onClick={() => router.push(teamGuideHref)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <ChevronLeft size={16} /> Back to Team
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>PROJECT:</span> {project?.name}
          </div>
        </div>

        <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '40px', boxShadow: 'var(--card-shadow)', marginBottom: '40px', backdropFilter: 'var(--glass-blur)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(66,127,131,.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)' }}>
                  <User size={24} />
                </div>
                <div>
                  <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>{roleTitle}</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0 0' }}>Role-specific roadmap with context, tasks, prompts, integration steps, and definition of done.</p>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(59,130,246,.05)', border: '1px solid rgba(59,130,246,.15)', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={18} color="var(--primary)" />
              <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Parallel Workflow Enabled</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Sidebar Nav */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Development Roadmap</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {roadmap?.map((step, i) => (
                  <button key={i} onClick={() => setActiveStep(i)} style={{
                    width: '100%', padding: '16px', borderRadius: '12px', textAlign: 'left',
                    background: activeStep === i ? 'rgba(66,127,131,.12)' : 'transparent',
                    border: `1px solid ${activeStep === i ? 'var(--accent-teal)' : 'transparent'}`,
                    transition: 'all 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: activeStep === i ? 'var(--accent-teal)' : 'var(--bg-3)', color: activeStep === i ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: activeStep === i ? 'var(--text-heading)' : 'var(--text-muted)' }}>{step.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            {roadmap && roadmap.length > 0 ? (
              <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '40px', boxShadow: 'var(--card-shadow)', animation: 'fadeUp 0.4s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>
                  <LayoutList size={14} /> Phase {activeStep + 1}
                </div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '16px' }}>{roadmap[activeStep].title}</h2>

                {roadmap[activeStep].context && (
                  <div style={{ marginBottom: '24px', background: 'rgba(66,127,131,.06)', border: '1px solid rgba(66,127,131,.18)', borderRadius: '16px', padding: '18px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '8px' }}>Why this phase matters</div>
                    <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 }}>{roadmap[activeStep].context}</div>
                  </div>
                )}
                
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.6', background: 'var(--bg-2)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--accent-teal)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Task Description:</div>
                    {roadmap[activeStep].description}
                  </div>
                </div>

                <div style={{ marginBottom: '32px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '13px', fontWeight: 800, marginBottom: '12px' }}>
                      <CheckCircle2 size={16} /> GOAL / DEFINITION OF DONE
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>
                      {roadmap[activeStep].goal}
                    </div>
                  </div>
                  
                  {roadmap[activeStep].tool && (
                    <div style={{ width: '220px', background: 'rgba(66,127,131,.05)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '8px' }}>Recommended AI Tool</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--accent-teal)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <Zap size={16} />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-heading)' }}>{roadmap[activeStep].tool}</span>
                      </div>
                      {roadmap[activeStep].usage && (
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '6px' }}>How to use this tool</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{roadmap[activeStep].usage}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {roadmap[activeStep].subSteps && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '16px', textTransform: 'uppercase' }}>Implementation Sub-steps</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                      {roadmap[activeStep].subSteps.map((sub: string, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>{idx + 1}</div>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {roadmap[activeStep].integration && (
                  <div style={{ marginBottom: '32px', background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px', textTransform: 'uppercase' }}>How to add it to your IDE safely</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{roadmap[activeStep].integration}</div>
                  </div>
                )}

                <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '13px', fontWeight: 800 }}>
                      <Zap size={16} /> OPTIMIZED AI PROMPT
                    </div>
                    <button 
                      onClick={() => handleCopy(roadmap[activeStep].prompt, activeStep)}
                      style={{ background: 'rgba(59,130,246,.08)', border: 'none', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {copiedIndex === activeStep ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      {copiedIndex === activeStep ? 'Copied!' : 'Copy Prompt'}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      readOnly
                      value={roadmap[activeStep].prompt}
                      style={{ width: '100%', height: '240px', background: 'var(--bg-3)', color: 'var(--text)', borderRadius: '16px', padding: '24px', fontSize: '13px', lineHeight: '1.6', border: '1px solid var(--border-subtle)', outline: 'none', fontFamily: 'var(--font-mono)', resize: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {[
                    { title: 'Before coding', text: 'Open only the files related to this role and phase.' },
                    { title: 'During coding', text: 'Review generated code before saving or committing it.' },
                    { title: 'Before handoff', text: 'Run the app, verify the goal, and note blockers clearly.' },
                  ].map(item => (
                    <div key={item.title} style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-teal)', marginBottom: '6px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.text}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep < roadmap.length - 1 ? (
                    <button onClick={() => setActiveStep(activeStep + 1)} style={{ background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Next Phase <Play size={14} />
                    </button>
                  ) : (
                    <button onClick={() => router.push(`/planner/deploy?project=${projectId}`)} style={{ background: 'linear-gradient(135deg, var(--success), #059669)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Go to Deployment <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
                <LayoutList size={42} color="var(--text-subtle)" style={{ marginBottom: '14px' }} />
                <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-heading)', margin: '0 0 8px' }}>No roadmap generated yet</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 20px' }}>
                  Go back and open this role again, or regenerate the team guide if the AI service returned an empty response.
                </p>
                <button onClick={() => router.push(teamGuideHref)} style={{ background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                  Back to Team Guide
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
