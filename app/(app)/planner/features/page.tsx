'use client'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore'
import { auth, db } from '@/utils/firebase/client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepIndicator, showToast } from '@/components/ui'
import { GripVertical, Trash2, Plus, ArrowRight, Layers, Cpu, Star, Sparkles, CheckCircle2, Circle } from 'lucide-react'
import type { Feature, Project } from '@/types'

const STEPS = ['Idea', 'Features', 'Architecture', 'Prompts', 'Blueprint', 'Deploy']
const COMPLEXITY_COLOR: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#f43f5e' }
const STACK_ICONS: Record<string, string> = {
  Next: 'N', React: '⚛️', Vue: 'V', Svelte: 'S', Flutter: '🐦',
  Node: '🟢', Python: '🐍', Go: '🐹', Supabase: '⚡', Firebase: '🔥',
  Postgres: '🐘', Mongo: '🍃', Redis: '🔴', Vercel: 'V', Railway: '🚂',
  Render: '☁️', AWS: '🌩️', Groq: '⚡', OpenAI: '🧠', Gemini: '✨', Clerk: '🔐',
}
function getIcon(name: string) {
  for (const [k, v] of Object.entries(STACK_ICONS)) {
    if (name.includes(k)) return v
  }
  return '🔧'
}

const CAT_COLORS: Record<string, string> = {
  frontend: '#427f83', backend: '#06b6d4', database: '#10b981',
  auth: '#f59e0b', ai: '#f43f5e', deployment: '#8b5cf6',
}

export default function FeaturesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const [project, setProject] = useState<Project | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newFeature, setNewFeature] = useState({ name: '', description: '', priority: 'must' as 'must'|'nice', complexity: 'medium' as 'low'|'medium'|'high' })
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [deleteNote, setDeleteNote] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    if (!projectId) { router.push('/planner'); return }
    loadData()
    // Save current step when visiting features page
    updateDoc(doc(db as any, 'projects', projectId), { current_step: 'features' }).catch(() => {})
  }, [projectId])

  async function loadData() {
    const [projSnap, featsSnap] = await Promise.all([
      getDoc(doc(db as any, 'projects', projectId!)),
      getDocs(query(collection(db as any, 'features'), where('project_id', '==', projectId)))
    ])
    const proj = projSnap.exists() ? { id: projSnap.id, ...projSnap.data() as any } : null
    const feats = featsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))

    if (!proj) { router.push('/dashboard'); return }
    setProject(proj as any)
    
    if (!feats?.length) {
      // Call AI to get recommended features
      try {
        const res = await fetch('/api/ai/features', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            idea: proj.idea, 
            platform: proj.platform,
            stack: proj.stack
          })
        })
        const data = await res.json()
        
        if (data.features && Array.isArray(data.features)) {
          const insertedRefs = await Promise.all(
            data.features.map((f: any, i: number) => 
              addDoc(collection(db as any, 'features'), { 
                ...f,
                project_id: projectId, 
                sort_order: i,
                why_important: f.why_important || ''
              })
            )
          )
          const inserted = insertedRefs.map((r: any, i: number) => ({ 
            id: r.id, 
            ...data.features[i], 
            project_id: projectId, 
            sort_order: i 
          }))
          setFeatures(inserted as any)
          showToast('✓ AI recommended features for your project!')
        }
      } catch (err) {
        console.error('Error loading recommended features:', err)
        showToast('Could not load recommended features')
      }
    } else {
      setFeatures(feats as any)
    }
    setLoading(false)
  }

  async function addFeature() {
    if (!newFeature.name.trim() || !projectId || !project) return
    
    // Validate feature with AI
    setValidating(true)
    try {
      const res = await fetch('/api/ai/validate-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureName: newFeature.name,
          featureDescription: newFeature.description,
          projectIdea: project.idea,
          platform: project.platform,
          stack: project.stack
        })
      })
      const validation = await res.json()
      setValidationResult(validation)
      
      if (!validation.suitable) {
        showToast('⚠️ Feature might not be suitable for this idea')
        setValidating(false)
        return
      }
      
      // Add feature since it's suitable
      const ref = await addDoc(collection(db as any, 'features'), {
        project_id: projectId,
        ...newFeature,
        sort_order: features.length,
        why_important: validation.reason,
        suitability_score: validation.suitabilityScore
      })
      const data = {
        id: ref.id,
        project_id: projectId,
        ...newFeature,
        sort_order: features.length,
        why_important: validation.reason,
        suitability_score: validation.suitabilityScore
      }
      setFeatures((p: any) => [...p, data])
      setNewFeature({ name: '', description: '', priority: 'must', complexity: 'medium' })
      setShowAdd(false)
      setValidationResult(null)
      showToast('✓ Feature added (Suitable score: ' + validation.suitabilityScore + '%)')
    } catch (err) {
      console.error('Validation error:', err)
      showToast('Error validating feature')
    }
    setValidating(false)
  }

  async function deleteFeature(f: Feature) {
    await deleteDoc(doc(db as any, 'features', f.id))
    setFeatures((p: any) => p.filter((x: any) => x.id !== f.id))
    if (f.why_important) {
      setDeleteNote(`Removed: "${f.name}" might not be essential for this specific idea.`)
      setTimeout(() => setDeleteNote(null), 3000)
    }
  }

  async function togglePriority(f: Feature) {
    const np = f.priority === 'must' ? 'nice' : 'must'
    await updateDoc(doc(db as any, 'features', f.id), { priority: np })
    setFeatures((p: any) => p.map((x: any) => x.id === f.id ? { ...x, priority: np } : x))
  }


  function onDragStart(i: number) { setDragIdx(i) }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    const arr = [...features]; const [m] = arr.splice(dragIdx, 1); arr.splice(i, 0, m)
    setDragIdx(i); setFeatures(arr)
  }
  async function onDragEnd() {
    setDragIdx(null)
    await Promise.all(features.map((f: any, i: number) => updateDoc(doc(db as any, 'features', f.id), { sort_order: i })))
  }

  const must = features.filter(f => f.priority === 'must')
  const nice = features.filter(f => f.priority === 'nice')
  const score = features.reduce((s, f) => s + ({ low: 1, medium: 2, high: 3 }[f.complexity] || 2), 0)
  const maxScore = features.length * 3 || 1
  const stackEntries = project?.stack ? Object.entries(project.stack) : []

  if (loading) return (
    <div style={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '12px', color: '#607276' }}>
      <div style={{ width: '18px', height: '18px', border: '2px solid rgba(66,127,131,.3)', borderTopColor: '#427f83', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Loading features...
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(38,69,72,.08)', border: '1px solid rgba(38,69,72,.12)',
    borderRadius: '8px', padding: '9px 12px', color: '#172326', fontSize: '13px',
    outline: 'none', fontFamily: 'DM Sans, sans-serif', marginBottom: '8px', boxSizing: 'border-box'
  }

  return (
    <div style={{ height: 'calc(100vh - 58px)', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <StepIndicator steps={STEPS} current={1} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px' }}>
              Build Blocks — <span style={{ color: 'var(--accent-teal)' }}>{project?.name}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Drag to reorder · Click priority to toggle · Delete unwanted blocks</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[{ label: 'Must Have', val: must.length, color: 'var(--accent-teal)' }, { label: 'Nice to Have', val: nice.length, color: 'var(--accent-cyan)' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 16px' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{s.label}</div>
              </div>
            ))}
            <button onClick={() => router.push(`/planner/architecture?project=${projectId}`)} style={{
              padding: '10px 20px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', border: 'none',
              borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(66,127,131,.3)'
            }}>
              Architecture <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>

        {/* LEFT — Build Blocks */}
        <div style={{ overflowY: 'auto', padding: '20px 20px 20px 28px', borderRight: '1px solid var(--border-subtle)' }}>

          {/* Complexity bar */}
          <div style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>Complexity Score <strong style={{ color: 'var(--accent-teal)' }}>{score}</strong></span>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace' }}>~{project?.estimated_hours || features.length * 3}h total</span>
            </div>
            <div style={{ height: '5px', background: 'var(--bg-2)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (score / maxScore) * 100)}%`, background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))', borderRadius: '3px', transition: 'width 0.4s' }} />
            </div>
          </div>

          {/* Delete Note */}
          {deleteNote && <div style={{ background: 'rgba(244,63,94,.1)', border: '1px solid rgba(244,63,94,.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', color: '#f43f5e', fontSize: '12px' }}>{deleteNote}</div>}

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {features.length === 0 && !loading && (
              <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface-overlay)', border: '1px dashed var(--border-subtle)', borderRadius: '16px' }}>
                <Sparkles size={32} color="var(--text-subtle)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '16px', fontWeight: 800 }}>No features generated yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '8px 0 20px' }}>Our AI might be taking a break. Click below to try generating recommendations again.</p>
                <button onClick={loadData} style={{
                  padding: '10px 24px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))',
                  border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(66,127,131,.2)'
                }}>
                  <Cpu size={14} /> Generate AI Recommendations
                </button>
              </div>
            )}
            {features.map((f, i) => (
              <div key={f.id} draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                style={{
                  background: dragIdx === i ? 'rgba(66,127,131,.12)' : 'var(--surface-overlay)',
                  border: `1px solid ${dragIdx === i ? 'var(--accent-teal)' : f.priority === 'must' ? 'rgba(66,127,131,0.3)' : 'var(--border-subtle)'}`,
                  borderRadius: '12px', padding: '14px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  cursor: 'grab', transition: 'all 0.15s',
                  borderLeft: `3px solid ${f.priority === 'must' ? 'var(--accent-teal)' : 'var(--border-subtle)'}`
                }}
              >
                <GripVertical size={14} color="var(--text-subtle)" style={{ marginTop: '4px', flexShrink: 0 }} />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>{f.name}</span>
                    <button onClick={() => togglePriority(f)} style={{
                      padding: '3px 9px', borderRadius: '20px', fontSize: '10px', fontWeight: 600,
                      fontFamily: 'DM Mono, monospace', cursor: 'pointer', border: 'none',
                      background: f.priority === 'must' ? 'rgba(66,127,131,.2)' : 'var(--bg-2)',
                      color: f.priority === 'must' ? 'var(--accent-teal)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      {f.priority === 'must' ? <Star size={9} fill="var(--accent-teal)" /> : <Circle size={9} />}
                      {f.priority === 'must' ? 'Must Have' : 'Nice to Have'}
                    </button>
                    <span style={{
                      padding: '3px 9px', borderRadius: '20px', fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 600,
                      background: `${COMPLEXITY_COLOR[f.complexity]}15`, color: COMPLEXITY_COLOR[f.complexity],
                      border: `1px solid ${COMPLEXITY_COLOR[f.complexity]}30`
                    }}>{f.complexity}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.description}</div>
                  {f.why_important && <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '6px', fontStyle: 'italic' }}>💡 {f.why_important}</div>}
                </div>

                <button onClick={() => deleteFeature(f)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-subtle)', padding: '4px', flexShrink: 0, borderRadius: '6px', transition: 'all 0.15s'
                }}
                  onMouseOver={e => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.background = 'rgba(244,63,94,.1)' }}
                  onMouseOut={e => { e.currentTarget.style.color = 'var(--text-subtle)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Feature */}
          {showAdd ? (
            <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--accent-teal)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <input value={newFeature.name} onChange={e => setNewFeature({ ...newFeature, name: e.target.value })}
                placeholder="Feature name" onKeyDown={e => e.key === 'Enter' && addFeature()} style={{ ...inputStyle, background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', color: 'var(--text)' }} />
              <input value={newFeature.description} onChange={e => setNewFeature({ ...newFeature, description: e.target.value })}
                placeholder="Short description" style={{ ...inputStyle, background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', color: 'var(--text)' }} />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {(['must', 'nice'] as const).map(p => (
                  <button key={p} onClick={() => setNewFeature({ ...newFeature, priority: p })} style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${newFeature.priority === p ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                    background: newFeature.priority === p ? 'rgba(66,127,131,.2)' : 'transparent',
                    color: newFeature.priority === p ? 'var(--accent-teal)' : 'var(--text-muted)'
                  }}>★ Must Have</button>
                ))}
                {(['low', 'medium', 'high'] as const).map(c => (
                  <button key={c} onClick={() => setNewFeature({ ...newFeature, complexity: c })} style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${newFeature.complexity === c ? COMPLEXITY_COLOR[c] : 'var(--border-subtle)'}`,
                    background: newFeature.complexity === c ? `${COMPLEXITY_COLOR[c]}20` : 'transparent',
                    color: newFeature.complexity === c ? COMPLEXITY_COLOR[c] : 'var(--text-muted)'
                  }}>{c}</button>
                ))}
              </div>
              {validationResult && (
                <div style={{
                  background: validationResult.suitable ? 'rgba(16,185,129,.1)' : 'rgba(244,63,94,.1)',
                  border: `1px solid ${validationResult.suitable ? 'rgba(16,185,129,.3)' : 'rgba(244,63,94,.3)'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                  fontSize: '12px'
                }}>
                  <div style={{ color: validationResult.suitable ? '#10b981' : '#f43f5e', fontWeight: 600, marginBottom: '6px' }}>
                    {validationResult.suitable ? '✓ Suitable for idea' : '✗ Not suitable for idea'} ({validationResult.suitabilityScore}%)
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>{validationResult.reason}</div>
                  {validationResult.suggestion && (
                    <div style={{ color: 'var(--text-subtle)', fontSize: '11px', fontStyle: 'italic' }}>💡 {validationResult.suggestion}</div>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addFeature} disabled={validating || (validationResult && !validationResult.suitable)} style={{ padding: '8px 18px', background: validating || (validationResult && !validationResult.suitable) ? 'rgba(66,127,131,.4)' : 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, cursor: validating || (validationResult && !validationResult.suitable) ? 'not-allowed' : 'pointer', opacity: validating || (validationResult && !validationResult.suitable) ? 0.6 : 1 }}>{validating ? 'Validating...' : 'Add Feature'}</button>
                <button onClick={() => { setShowAdd(false); setValidationResult(null) }} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)} style={{
              width: '100%', padding: '12px', background: 'transparent',
              border: '1px dashed var(--accent-teal)', borderRadius: '12px',
              color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s'
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-teal)'; e.currentTarget.style.color = 'var(--accent-teal)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(66,127,131,0.3)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <Plus size={14} /> Add Build Block
            </button>
          )}
        </div>

        {/* RIGHT — Recommended Tech Stack Only */}
        <div style={{ overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Cpu size={16} color="var(--accent-teal)" />
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 800, color: 'var(--text-heading)' }}>Recommended Stack</span>
          </div>

          {stackEntries.length === 0 ? (
            <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '32px 20px', textAlign: 'center' }}>
              <Sparkles size={28} color="var(--text-subtle)" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: 'var(--text-subtle)', fontSize: '13px' }}>No stack selected yet.</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>Go back to Idea step to generate one.</div>
            </div>
          ) : (
            stackEntries.map(([cat, s]: [string, any]) => (
              <div key={cat} style={{
                background: 'var(--surface-overlay)', border: `1px solid ${CAT_COLORS[cat] || 'var(--accent-teal)'}25`,
                borderRadius: '12px', padding: '14px 16px', borderLeft: `3px solid ${CAT_COLORS[cat] || 'var(--accent-teal)'}`
              }}>
                <div style={{ fontSize: '9px', color: CAT_COLORS[cat] || 'var(--accent-teal)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{cat}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${CAT_COLORS[cat] || 'var(--accent-teal)'}15`, border: `1px solid ${CAT_COLORS[cat] || 'var(--accent-teal)'}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: CAT_COLORS[cat] || 'var(--accent-teal)', flexShrink: 0 }}>
                    {getIcon(s.name || '')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '2px' }}>{s.name}</div>
                    {s.why && <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.why}</div>}
                  </div>
                  <CheckCircle2 size={16} color={CAT_COLORS[cat] || 'var(--accent-teal)'} style={{ flexShrink: 0, opacity: 0.7 }} />
                </div>
                {s.free !== undefined && (
                  <div style={{ marginTop: '8px', padding: '4px 10px', background: s.free ? 'rgba(16,185,129,.08)' : 'rgba(249,115,22,.08)', border: `1px solid ${s.free ? 'rgba(16,185,129,.2)' : 'rgba(249,115,22,.2)'}`, borderRadius: '6px', fontSize: '10px', color: s.free ? '#10b981' : '#f97316', fontFamily: 'DM Mono, monospace', display: 'inline-block' }}>
                    {s.free ? '✓ Free tier' : '$ Paid'}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Feature summary by priority */}
          <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={14} color="var(--accent-teal)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Feature Summary</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Must Have', count: must.length, color: 'var(--accent-teal)' },
                { label: 'Nice to Have', count: nice.length, color: 'var(--accent-cyan)' },
                { label: 'Total Blocks', count: features.length, color: 'var(--text-muted)' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: r.color, fontFamily: 'Syne, sans-serif' }}>{r.count}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', height: '4px', background: 'var(--bg-2)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (score / maxScore) * 100)}%`, background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))', borderRadius: '2px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
