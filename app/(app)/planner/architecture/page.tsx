'use client'

import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepIndicator } from '@/components/ui'
import { db } from '@/utils/firebase/client'
import {
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Download,
  FileCode2,
  Layers3,
  LockKeyhole,
  Server,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/tools-data'

type ArchitectureTool = {
  id?: string
  name: string
  category?: string
  layer?: string
  reason?: string
  relevance?: number
  configuration?: string
  description?: string
}

type StackItem = {
  name?: string
  reason?: string
}

const FLOW = [
  { key: 'frontend', label: 'Interface', icon: Code2, layer: 'Frontend', desc: 'Screens, forms, navigation, and responsive user flows.' },
  { key: 'auth', label: 'Access', icon: LockKeyhole, layer: 'Backend', desc: 'Login, route protection, sessions, and user ownership.' },
  { key: 'backend', label: 'Logic', icon: Server, layer: 'Backend', desc: 'API routes, validation, business rules, and integrations.' },
  { key: 'database', label: 'Data', icon: Database, layer: 'Data', desc: 'Schemas, collections, persistence, and query patterns.' },
  { key: 'ai', label: 'AI Layer', icon: BrainCircuit, layer: 'Backend', desc: 'Prompt routes, model calls, fallback behavior, and AI output.' },
  { key: 'deployment', label: 'Ship', icon: Cloud, layer: 'DevOps', desc: 'Hosting, environment variables, build checks, and release.' },
]

const FEATURE_COLUMNS = [
  { label: 'UI Route', icon: Code2, hint: 'page, form, state' },
  { label: 'API Contract', icon: FileCode2, hint: 'request, response' },
  { label: 'Data Model', icon: Database, hint: 'fields, owner, status' },
  { label: 'AI/Automation', icon: Bot, hint: 'only where useful' },
]

function stackName(stack: any, key: string, fallback: string) {
  return stack?.[key]?.name || fallback
}

function stackReason(stack: any, key: string, fallback: string) {
  return stack?.[key]?.reason || fallback
}

function featureSlug(feature: any) {
  return (feature?.name || 'feature').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'feature'
}

function toolLayerColor(layer?: string) {
  if (layer === 'Frontend') return '#6366f1'
  if (layer === 'Backend') return '#f97316'
  if (layer === 'Data') return '#06b6d4'
  if (layer === 'DevOps') return '#10b981'
  return '#427f83'
}

export default function ArchitecturePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const [project, setProject] = useState<any>(null)
  const [features, setFeatures] = useState<any[]>([])
  const [aiTools, setAiTools] = useState<ArchitectureTool[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const pageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!projectId) {
      router.push('/planner')
      return
    }

    async function loadArchitecture() {
      try {
        const projectSnap = await getDoc(doc(db as any, 'projects', projectId!))
        if (!projectSnap.exists()) {
          setLoading(false)
          return
        }

        const projectData = { id: projectSnap.id, ...projectSnap.data() as any }
        setProject(projectData)

        const featureSnap = await getDocs(query(collection(db as any, 'features'), where('project_id', '==', projectId)))
        const loadedFeatures = featureSnap.docs
          .map((d: any) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        setFeatures(loadedFeatures)

        const cacheKey = `torus-architecture-tools:${projectId}`
        try {
          const cached = sessionStorage.getItem(cacheKey)
          if (cached) {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed.tools)) setAiTools(parsed.tools)
          }
        } catch {
          sessionStorage.removeItem(cacheKey)
        }

        try {
          const res = await fetch('/api/ai/recommend-tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectIdea: projectData.idea,
              features: loadedFeatures,
              platform: projectData.platform,
              stack: projectData.stack || {},
            }),
          })
          const data = await res.json()
          if (Array.isArray(data.tools)) {
            setAiTools(data.tools)
            sessionStorage.setItem(cacheKey, JSON.stringify({ tools: data.tools, generatedAt: Date.now() }))
          }
        } catch (toolError) {
          console.warn('Could not load architecture AI tools:', toolError)
        }

        updateDoc(doc(db as any, 'projects', projectId!), { current_step: 'architecture' }).catch(() => {})
      } finally {
        setLoading(false)
      }
    }

    loadArchitecture()
  }, [projectId, router])

  const toolsByLayer = useMemo(() => {
    return aiTools.reduce<Record<string, ArchitectureTool[]>>((acc, tool) => {
      const layer = tool.layer || 'General'
      if (!acc[layer]) acc[layer] = []
      acc[layer].push(tool)
      return acc
    }, {})
  }, [aiTools])

  async function handleDownloadPdf() {
    if (!pageRef.current) return

    setExporting(true)
    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth - 16
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 8

      pdf.addImage(imgData, 'PNG', 8, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight - 16

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 8
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 8, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight - 16
      }

      const filename = `${(project?.name || 'architecture').toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'architecture'}.pdf`
      pdf.save(filename)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
        <div style={{ width: 16, height: 16, border: '2px solid rgba(66,127,131,.3)', borderTopColor: 'var(--accent-teal)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        Loading architecture workspace...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div ref={pageRef} style={{ minHeight: 'calc(100vh - 58px)', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ padding: '18px 28px 0', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-overlay)' }}>
        <StepIndicator steps={['Idea', 'Features', 'Architecture', 'Prompts', 'Blueprint', 'Deploy']} current={2} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, paddingBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent-teal)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              <Layers3 size={16} /> Architecture Workspace
            </div>
            <h1 style={{ margin: '8px 0 4px', fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-heading)' }}>
              {project?.name || 'Project'} System Map
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5, maxWidth: 760 }}>
              A clean build map showing how screens, auth, APIs, data, AI tools, and deployment connect for this project.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button onClick={handleDownloadPdf} disabled={exporting} style={{ padding: '11px 16px', background: 'var(--bg-2)', color: 'var(--text-heading)', border: '1px solid var(--border-subtle)', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: exporting ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, opacity: exporting ? 0.8 : 1 }}>
              <Download size={15} /> {exporting ? 'Preparing PDF…' : 'Download PDF'}
            </button>
            <button onClick={() => router.push(`/planner/architecture/guide?project=${projectId}`)} style={{ padding: '11px 16px', background: 'var(--bg-2)', color: 'var(--text-heading)', border: '1px solid var(--border-subtle)', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <User size={15} /> Solo Guide
            </button>
            <button onClick={() => router.push(`/planner/architecture/team-guide?project=${projectId}`)} style={{ padding: '11px 16px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(66,127,131,.22)' }}>
              <Users size={15} /> Team Guide <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <main style={{ padding: 28, display: 'grid', gap: 24, maxWidth: 1320, margin: '0 auto' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 18 }}>
          <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Boxes size={18} color="var(--accent-teal)" />
              <h2 style={{ margin: 0, color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800 }}>Build Flow</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 10 }}>
              {FLOW.map((item, idx) => {
                const Icon = item.icon
                const stack = project?.stack?.[item.key] as StackItem | undefined
                return (
                  <div key={item.key} style={{ position: 'relative', minHeight: 190 }}>
                    <div style={{ height: '100%', background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${toolLayerColor(item.layer)}1a`, color: toolLayerColor(item.layer), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace' }}>{idx + 1}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--accent-teal)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                        <div style={{ color: 'var(--text-heading)', fontSize: 15, fontWeight: 800, lineHeight: 1.25 }}>{stack?.name || stackName(project?.stack, item.key, item.label)}</div>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.45 }}>{stack?.reason || item.desc}</p>
                    </div>
                    {idx < FLOW.length - 1 && (
                      <div style={{ position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', zIndex: 2 }}>
                        <ArrowRight size={13} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Sparkles size={18} color="var(--accent-teal)" />
              <h2 style={{ margin: 0, color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800 }}>Project Context</h2>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--accent-teal)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Idea</div>
                <div style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.55 }}>{project?.idea || 'No idea found.'}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Platform', value: project?.platform || 'Web' },
                  { label: 'Experience', value: project?.experience || 'Not set' },
                  { label: 'Features', value: String(features.length) },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{item.label}</div>
                    <div style={{ color: 'var(--text-heading)', fontSize: 13, fontWeight: 800, marginTop: 6 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800 }}>Feature Implementation Lanes</h2>
              <p style={{ margin: '5px 0 0', color: 'var(--text-muted)', fontSize: 12 }}>Every feature is represented across UI, API, data, and AI/automation so the next guide can generate precise prompts.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr repeat(4, 1fr)', gap: 10, alignItems: 'stretch' }}>
            <div />
            {FEATURE_COLUMNS.map(column => {
              const Icon = column.icon
              return (
                <div key={column.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-heading)', fontWeight: 800, fontSize: 12 }}>
                    <Icon size={14} color="var(--accent-teal)" /> {column.label}
                  </div>
                  <div style={{ marginTop: 4, color: 'var(--text-subtle)', fontSize: 11 }}>{column.hint}</div>
                </div>
              )
            })}

            {(features.length ? features : [{ name: 'Core feature', description: 'Generate project features first to fill this lane.' }]).slice(0, 8).map((feature: any) => (
              <div key={feature.id || feature.name} style={{ display: 'contents' }}>
                <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 14 }}>
                  <div style={{ color: 'var(--text-heading)', fontSize: 13, fontWeight: 800, marginBottom: 5 }}>{feature.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, lineHeight: 1.45 }}>{feature.description || 'No description provided.'}</div>
                </div>
                <LaneCell text={`/${featureSlug(feature)}`} detail="screen and states" />
                <LaneCell text={`/api/${featureSlug(feature)}`} detail="typed route" />
                <LaneCell text={`${featureSlug(feature)} record`} detail="owner and status" />
                <LaneCell text={stackName(project?.stack, 'ai', 'AI optional')} detail="use only if useful" />
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {['Frontend', 'Backend', 'Data', 'DevOps'].map(layer => (
            <div key={layer} style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0, color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 800 }}>{layer} AI Tools</h3>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: toolLayerColor(layer) }} />
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {(toolsByLayer[layer] || []).slice(0, 3).map(tool => (
                  <div key={`${layer}-${tool.id || tool.name}`} style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ color: 'var(--text-heading)', fontSize: 13, fontWeight: 800 }}>{tool.name}</div>
                      {typeof tool.relevance === 'number' && <div style={{ color: 'var(--accent-teal)', fontSize: 11, fontWeight: 800 }}>{tool.relevance}%</div>}
                    </div>
                    <p style={{ margin: '7px 0 0', color: 'var(--text-muted)', fontSize: 11, lineHeight: 1.45 }}>{tool.reason || tool.description || 'Recommended for this project layer.'}</p>
                  </div>
                ))}
                {!(toolsByLayer[layer] || []).length && (
                  <div style={{ color: 'var(--text-subtle)', fontSize: 12, lineHeight: 1.5, background: 'var(--bg-2)', border: '1px dashed var(--border-subtle)', borderRadius: 12, padding: 12 }}>
                    No tools generated for this layer yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
          {CATEGORIES.slice(0, 6).map(category => (
            <div key={category.id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 14 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', fontWeight: 800 }}>{category.label}</div>
              <div style={{ color: 'var(--text-heading)', fontSize: 14, fontWeight: 800, marginTop: 5 }}>
                {stackName(project?.stack, category.id, category.label)}
              </div>
              <p style={{ margin: '7px 0 0', color: 'var(--text-subtle)', fontSize: 11, lineHeight: 1.45 }}>
                {stackReason(project?.stack, category.id, 'Used as part of the generated project architecture.')}
              </p>
            </div>
          ))}
        </section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingBottom: 24 }}>
          <button onClick={() => router.push(`/planner/architecture/guide?project=${projectId}`)} style={{ padding: '12px 18px', background: 'var(--bg-2)', color: 'var(--text-heading)', border: '1px solid var(--border-subtle)', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Solo Developer Guide
          </button>
          <button onClick={() => router.push(`/planner/architecture/team-guide?project=${projectId}`)} style={{ padding: '12px 18px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Continue to Team Guide <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  )
}

function LaneCell({ text, detail }: { text: string; detail: string }) {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12, minHeight: 74 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-heading)', fontSize: 12, fontWeight: 800 }}>
        <CheckCircle2 size={13} color="var(--accent-teal)" /> {text}
      </div>
      <div style={{ color: 'var(--text-subtle)', fontSize: 11, marginTop: 6 }}>{detail}</div>
    </div>
  )
}
