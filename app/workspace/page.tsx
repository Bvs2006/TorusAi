'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
const supabase = createClient()
import { showToast } from '@/components/ui'
import { Copy, Check, RefreshCw, Zap, Bot, ArrowRight, Folder, Database, CheckCircle2, FileCode, CheckSquare, Wrench, HelpCircle, LogOut } from 'lucide-react'
import type { Project, Phase } from '@/types'

import { Suspense } from 'react'

const TOOLS = ['Cursor', 'Windsurf', 'Bolt.new', 'Lovable', 'Replit']

function WorkspaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const [project, setProject] = useState<Project | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])
  const [activePhase, setActivePhase] = useState(0)
  const [selectedTool, setSelectedTool] = useState('Cursor')
  const [prompt, setPrompt] = useState('')
  const [tips, setTips] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showRobot, setShowRobot] = useState(false)
  const [errorLog, setErrorLog] = useState('')
  const [fixing, setFixing] = useState(false)

  useEffect(() => {
    if (!projectId) { router.push('/planner'); return }
    loadData()
  }, [projectId])

  async function loadData() {
    const [{ data: proj }, { data: phaseData }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', projectId).single(),
      supabase.from('phases').select('*').eq('project_id', projectId).order('phase_number')
    ])
    if (!proj) { router.push('/dashboard'); return }
    setProject(proj)
    setPhases(phaseData || [])
    if (phaseData && phaseData.length > 0) {
      if (phaseData[0].prompt) setPrompt(phaseData[0].prompt)
      else generatePrompt(proj, phaseData[0], 'Cursor')
    }
    setLoading(false)
  }

  async function generatePrompt(proj: Project, phase: Phase, tool: string) {
    setGenerating(true)
    try {
      const features = await supabase.from('features').select('name').eq('project_id', proj.id)
      const res = await fetch('/api/ai/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase, tool,
          stack: proj.stack,
          projectIdea: proj.idea,
          features: features.data?.map(f => f.name) || [],
          experience: proj.experience
        })
      })
      const data = await res.json()
      setPrompt(data.prompt || '')
      setTips(data.tips || [])
      await supabase.from('phases').update({ prompt: data.prompt }).eq('id', phase.id)
    } catch (err) {
      showToast('Failed to generate prompt. Try again.')
    }
    setGenerating(false)
  }

  async function selectPhase(idx: number) {
    setActivePhase(idx)
    setCopied(false)
    const phase = phases[idx]
    if (!phase || !project) return
    if (phase.prompt && selectedTool === 'Cursor') {
      setPrompt(phase.prompt)
    } else {
      generatePrompt(project, phase, selectedTool)
    }
  }

  async function switchTool(tool: string) {
    setSelectedTool(tool)
    setCopied(false)
    const phase = phases[activePhase]
    if (phase && project) generatePrompt(project, phase, tool)
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    showToast('✓ Prompt copied to clipboard!')
    setTimeout(() => setCopied(false), 3000)
  }

  async function markDone() {
    const phaseId = phases[activePhase].id
    await supabase.from('phases').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', phaseId)
    setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, status: 'done' } : p))
    showToast('🎉 Milestone verified & saved!')
    if (activePhase < phases.length - 1) selectPhase(activePhase + 1)
  }

  async function openInTool(tool: string) {
    const urls: Record<string, string> = {
      'Cursor': 'cursor://open',
      'Windsurf': 'windsurf://open',
      'Bolt.new': 'https://bolt.new',
      'Lovable': 'https://lovable.dev',
      'Replit': 'https://replit.com/new',
    }
    await navigator.clipboard.writeText(prompt)
    showToast(`✓ Prompt copied! Opening ${tool}...`)
    window.open(urls[tool] || urls['Bolt.new'], '_blank')
  }

  async function generateFixPrompt() {
    if (!errorLog) return
    setFixing(true)
    try {
      const res = await fetch('/api/ai/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: errorLog,
          context: `Fixing an error while working on Phase ${phases[activePhase]?.phase_number}: ${phases[activePhase]?.name}`,
          stack: project?.stack,
        })
      })
      const data = await res.json()
      if (data.fixedPrompt) {
        setPrompt(data.fixedPrompt)
        setShowRobot(false)
        setErrorLog('')
        showToast('✓ Fix prompt generated!')
      } else {
        showToast('Failed to generate fix prompt.')
      }
    } catch (err) {
      showToast('Error generating fix prompt.')
    }
    setFixing(false)
  }

  if (loading) return (
    <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '10px', color: '#607276' }}>
      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(66,127,131,.3)', borderTopColor: '#427f83', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Loading Golden Grid Workspace...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const currentPhase = phases[activePhase]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#eef3f4' }}>
      
      {/* Top Bar */}
      <div style={{ height: '44px', background: '#eef3f4', borderBottom: '1px solid rgba(38,69,72,.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '15px', color: '#172326', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }} />
            </span>
            Torus<span style={{ color: '#5aa0a4' }}>AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', color: '#607276', fontSize: '12px' }}>
            <span style={{ cursor: 'pointer' }}>File</span>
            <span style={{ cursor: 'pointer' }}>Edit</span>
            <span style={{ cursor: 'pointer' }}>View</span>
            <span style={{ cursor: 'pointer' }}>Tools</span>
          </div>
        </div>
        <div style={{ color: '#172326', fontSize: '13px', fontFamily: 'Syne, sans-serif' }}>
          TorusAI Task-Based Workspace: The Cockpit of Your Project
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(38,69,72,.1)', border: '1px solid rgba(38,69,72,.14)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#607276', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            Vibe: {currentPhase?.name || 'UI Development'} <span style={{ opacity: 0.5 }}>▼</span>
          </div>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #83b9bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#fff', cursor: 'pointer' }}>
            U
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Activity Bar */}
        <div style={{ width: '48px', background: '#eef3f4', borderRight: '1px solid rgba(38,69,72,.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <FileCode size={20} color="#427f83" style={{ cursor: 'pointer' }} />
            <CheckSquare size={20} color="#8a9a9d" style={{ cursor: 'pointer' }} />
            <Folder size={20} color="#8a9a9d" style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <Wrench size={18} color="#8a9a9d" style={{ cursor: 'pointer' }} />
            <HelpCircle size={18} color="#8a9a9d" style={{ cursor: 'pointer' }} />
            <LogOut size={18} color="#8a9a9d" style={{ cursor: 'pointer' }} onClick={() => router.push('/dashboard')} />
          </div>
        </div>

        {/* Golden Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr 300px', overflow: 'hidden' }}>
          
          {/* LEFT PANE: Adaptive Roadmap */}
          <div style={{ background: '#eef3f4', borderRight: '1px solid rgba(38,69,72,.1)', padding: '20px', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Adaptive Roadmap
        </div>
        {phases.map((phase, i) => {
          const isActive = activePhase === i
          const isDone = phase.status === 'done'
          return (
            <button key={phase.id} onClick={() => selectPhase(i)} style={{
              width: '100%', textAlign: 'left', padding: '12px', marginBottom: '8px',
              borderRadius: '10px', border: isActive ? '1px solid #0ea5e9' : '1px solid rgba(38,69,72,.1)',
              background: isActive ? 'rgba(14,165,233,.1)' : 'transparent',
              boxShadow: isActive ? '0 0 15px rgba(14,165,233,.2)' : 'none',
              cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
            }}>
              {isActive && <div style={{ position: 'absolute', left: 0, top: '10%', height: '80%', width: '3px', background: '#38bdf8', borderRadius: '0 4px 4px 0', animation: 'pulse 2s infinite' }} />}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ marginTop: '2px' }}>
                  {isDone ? <CheckCircle2 size={16} color="#10b981" /> : 
                   isActive ? <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #38bdf8' }} /> :
                   <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #8a9a9d' }} />}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#172326' : isDone ? '#607276' : '#8a9a9d', marginBottom: '2px' }}>
                    {phase.name}
                  </div>
                  {isActive ? (
                    <div style={{ fontSize: '10px', color: '#38bdf8', fontFamily: 'DM Mono, monospace', animation: 'pulse 2s infinite' }}>
                      (Active, pulsing)
                    </div>
                  ) : (
                    <div style={{ fontSize: '10px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>
                      Phase {phase.phase_number} · {phase.duration || '2-3h'}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* CENTER PANE: Execution Block */}
      <div style={{ background: 'rgba(255,255,255,.54)', padding: '24px 32px', overflowY: 'auto', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#172326', margin: 0 }}>
              {currentPhase?.phase_number}.{currentPhase?.phase_number} {currentPhase?.name}
            </h2>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326', marginBottom: '6px' }}>Objective</div>
              <p style={{ color: '#607276', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                Implement {currentPhase?.name.toLowerCase()} for the {project?.platform} app.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326', marginBottom: '8px' }}>Tool Recommendation</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => openInTool(selectedTool)} style={{
              background: 'rgba(14,165,233,.1)', border: '1px solid rgba(14,165,233,.3)', borderRadius: '8px',
              padding: '8px 16px', color: '#38bdf8', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s'
            }}>
              Open in {selectedTool} (Recommended)
            </button>
            <select value={selectedTool} onChange={e => switchTool(e.target.value)} style={{
              background: 'rgba(38,69,72,.07)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '8px',
              padding: '8px 12px', color: '#607276', fontSize: '12px', outline: 'none', cursor: 'pointer'
            }}>
              <option disabled>or open alternative other alternative tools</option>
              {TOOLS.map(t => <option key={t} value={t} style={{ background: 'rgba(255,255,255,.54)' }}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* The Master Prompt */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326', marginBottom: '8px' }}>The Master Prompt</div>
          <div style={{ background: '#eef3f4', border: '1px solid rgba(38,69,72,.14)', borderRadius: '8px', padding: '16px', position: 'relative', marginBottom: '8px' }}>
            <button onClick={copyPrompt} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(38,69,72,.1)', border: '1px solid rgba(38,69,72,.14)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#607276', transition: 'all 0.2s' }}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
            {generating ? (
              <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(14,165,233,.3)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <div style={{ color: '#8a9a9d', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>Generating prompt...</div>
              </div>
            ) : (
              <pre style={{ fontSize: '13px', color: '#172326', fontFamily: 'DM Mono, monospace', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, maxHeight: '200px', overflowY: 'auto', paddingRight: '30px' }}>
                {prompt || 'Select a phase to generate a prompt.'}
              </pre>
            )}
          </div>
          <button onClick={copyPrompt} style={{
            width: '100%', background: 'rgba(14,165,233,.15)', border: '1px solid rgba(14,165,233,.4)', borderRadius: '8px',
            padding: '10px', color: '#38bdf8', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne, sans-serif', transition: 'all 0.2s'
          }}>
            Copy Master Prompt
          </button>
        </div>

        {/* Process Guide */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326', marginBottom: '8px' }}>Process Guide</div>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#172326', fontSize: '13px', lineHeight: '1.8' }}>
            <li>Paste prompt into {selectedTool}.</li>
            <li>Review and adjust {selectedTool} output.</li>
            <li>Download generated code.</li>
            <li>Place in <strong style={{ color: '#83b9bd' }}>/components/Dashboard</strong>.</li>
          </ol>
        </div>

        {/* Validation */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326', marginBottom: '8px' }}>Validation</div>
          <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#172326', marginBottom: '12px' }}>Verify & Unlock</div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '16px' }}>
              <input type="checkbox" checked={currentPhase?.status === 'done'} onChange={() => {}} style={{ marginTop: '3px', accentColor: '#38bdf8' }} />
              <span style={{ fontSize: '13px', color: '#172326', lineHeight: '1.5' }}>Does the UI render without errors and respond correctly to screen sizes?</span>
            </label>
            <button onClick={markDone} disabled={currentPhase?.status === 'done'} style={{
              padding: '8px 16px', background: currentPhase?.status === 'done' ? 'rgba(255,255,255,.62)' : 'rgba(38,69,72,.14)',
              border: `1px solid ${currentPhase?.status === 'done' ? 'rgba(38,69,72,.1)' : 'rgba(255,255,255,.2)'}`,
              borderRadius: '6px', color: currentPhase?.status === 'done' ? '#8a9a9d' : '#172326',
              fontSize: '12px', cursor: currentPhase?.status === 'done' ? 'not-allowed' : 'pointer'
            }}>
              {currentPhase?.status === 'done' ? 'Milestone Saved' : 'Save Milestone'}
            </button>
          </div>
        </div>

        {/* Robot Fixer Floating Button */}
        <button onClick={() => setShowRobot(!showRobot)} style={{
          position: 'absolute', bottom: '24px', right: '32px', width: '50px', height: '50px',
          borderRadius: '50%', background: '#f43f5e', border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(244,63,94,.4)', transition: 'transform 0.2s', zIndex: 10
        }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} title="Robot Fixer">
          <Bot size={24} />
        </button>

        {/* Robot Fixer Panel */}
        {showRobot && (
          <div style={{
            position: 'absolute', bottom: '85px', right: '32px', width: '380px', background: 'rgba(255,255,255,.62)',
            border: '1px solid #f43f5e', borderRadius: '16px', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,.5)', zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Bot size={20} color="#f43f5e" />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Robot Fixer</div>
            </div>
            <p style={{ fontSize: '12px', color: '#607276', marginBottom: '16px' }}>
              Hit a snag? Paste your error code below and I&rsquo;ll generate a recovery prompt for {selectedTool}.
            </p>
            <textarea
              value={errorLog} onChange={e => setErrorLog(e.target.value)}
              placeholder="Paste terminal error or bug description here..."
              style={{ width: '100%', height: '100px', background: '#eef3f4', border: '1px solid rgba(38,69,72,.14)', borderRadius: '8px', padding: '10px', color: '#172326', fontSize: '12px', fontFamily: 'DM Mono, monospace', outline: 'none', resize: 'none', marginBottom: '16px' }}
            />
            <button onClick={generateFixPrompt} disabled={!errorLog || fixing} style={{
              width: '100%', padding: '10px', background: '#f43f5e', border: 'none', borderRadius: '8px',
              color: '#fff', fontWeight: 700, fontSize: '13px', cursor: (!errorLog || fixing) ? 'not-allowed' : 'pointer', opacity: (!errorLog || fixing) ? 0.5 : 1
            }}>
              {fixing ? 'Generating Fix...' : 'Generate Fix Prompt'}
            </button>
          </div>
        )}
      </div>

      {/* RIGHT PANE: Project Brain */}
      <div style={{ background: '#eef3f4', borderLeft: '1px solid rgba(38,69,72,.1)', padding: '20px', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
          Project Brain
        </div>

        {/* DB Schema */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#172326' }}>
            <Database size={14} color="#10b981" />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Database Schema</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '10px', padding: '12px' }}>
            {['users', 'projects', 'tasks', 'profiles'].map(table => (
              <div key={table} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px', borderRadius: '6px', fontSize: '12px', fontFamily: 'DM Mono, monospace',
                background: (currentPhase?.name.toLowerCase().includes('auth') && table === 'users') ? 'rgba(16,185,129,.15)' : 'transparent',
                border: (currentPhase?.name.toLowerCase().includes('auth') && table === 'users') ? '1px solid rgba(16,185,129,.3)' : '1px solid transparent',
                color: (currentPhase?.name.toLowerCase().includes('auth') && table === 'users') ? '#10b981' : '#607276',
                marginBottom: '4px'
              }}>
                <span>{table}</span>
                <span style={{ fontSize: '10px', color: '#8a9a9d' }}>table</span>
              </div>
            ))}
          </div>
        </div>

        {/* Folder Tree */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#172326' }}>
            <Folder size={14} color="#06b6d4" />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>File Structure</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#607276', fontFamily: 'DM Mono, monospace', lineHeight: '2' }}>
            <div>📁 app/</div>
            <div style={{ paddingLeft: '16px' }}>📄 layout.tsx</div>
            <div style={{ paddingLeft: '16px' }}>📄 page.tsx</div>
            <div style={{ paddingLeft: '16px' }}>📁 api/</div>
            <div>📁 components/</div>
            <div style={{ paddingLeft: '16px' }}>📄 ui.tsx</div>
            <div>📁 lib/</div>
            <div style={{ paddingLeft: '16px' }}>📄 utils.ts</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
      </div>
    </div>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', color: '#172326' }}>Loading Workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  )
}
