'use client'
import { useState } from 'react'
import { useTeam } from '@/app/(app)/team/TeamContext'
import { Terminal, LayoutGrid as Layout, ArrowRight, CheckCircle2, ChevronRight, Search, Play, ExternalLink, Copy, Zap, ShieldAlert } from 'lucide-react'

export default function WorkflowCanvas() {
  const { activeProject, activeRole, activeNode, setActiveNode, nodeDataCache, refreshNodes } = useTeam()
  const [generating, setGenerating] = useState(false)

  if (!activeProject) {
    return <div style={{ padding: '40px', color: '#a0a5ab' }}>No project selected. Go to Idea Analyzer to create one.</div>
  }

  const STAGES = activeProject.custom_workflow_stages || []
  const stageData = nodeDataCache[activeNode]
  const activeStageDetails = STAGES.find((s: any) => s.id === activeNode)

  async function handleGenerateNode() {
    setGenerating(true)
    try {
      const res = await fetch('/api/team/generate-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          nodeId: activeNode,
          nodeTitle: activeStageDetails?.title || 'Execution Stage',
          projectContext: activeProject,
          roleContext: activeStageDetails?.owner_role || activeRole
        })
      })
      if (!res.ok) throw new Error('Failed to generate')
      await refreshNodes()
    } catch (e) {
      console.error(e)
      alert('Failed to generate node data.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#a0a5ab', marginBottom: '8px' }}>
            <span style={{ color: '#e5e7eb' }}>{activeProject.name}</span> <ChevronRight size={14} /> 
            <span style={{ color: '#e5e7eb' }}>{activeRole || 'Select Role'}</span> <ChevronRight size={14} /> 
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>{activeStageDetails?.title || 'Execution Phase'}</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Syne, sans-serif' }}>Project Execution</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#1a1b1e', border: '1px solid #2a2c32', borderRadius: '8px', padding: '8px 12px', width: '240px' }}>
            <Search size={16} color="#565b63" style={{ marginRight: '8px' }} />
            <input placeholder="Search tasks, docs..." style={{ background: 'transparent', border: 'none', color: '#e5e7eb', fontSize: '13px', outline: 'none', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '-8px' }}>
            {['A', 'B', 'C'].map((avatar, i) => (
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: i===0?'#3b82f6':i===1?'#10b981':'#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, border: '2px solid #09090b', zIndex: 3-i, position: 'relative', marginLeft: i > 0 ? '-8px' : '0' }}>{avatar}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Tracker (Dynamic length based on custom stages) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', background: '#111214', border: '1px solid #1e1f23', borderRadius: '12px', padding: '20px 32px', overflowX: 'auto' }}>
        {STAGES.map((stage: any, i: number) => {
          const isCurrent = stage.id === activeNode;
          const isDone = nodeDataCache[stage.id] && !isCurrent;
          return (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isDone ? '#10b981' : isCurrent ? '#3b82f6' : '#2a2c32', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isCurrent ? '0 0 12px rgba(59,130,246,0.5)' : 'none', flexShrink: 0 }}>
                  {isDone && <CheckCircle2 size={12} color="#fff" />}
                  {isCurrent && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }} />}
                </div>
                <span style={{ fontSize: '13px', fontWeight: isCurrent ? 700 : 600, color: isDone || isCurrent ? '#e5e7eb' : '#565b63', whiteSpace: 'nowrap' }}>{stage.title}</span>
              </div>
              {i < STAGES.length - 1 && <div style={{ width: '40px', height: '2px', background: isDone ? '#10b981' : '#2a2c32' }} />}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Workflow Graph */}
        <div style={{ width: '360px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '23px', top: '24px', bottom: '24px', width: '2px', background: '#2a2c32', zIndex: 0 }} />
          
          {STAGES.map((stage: any) => {
            const isActive = activeNode === stage.id
            const hasData = !!nodeDataCache[stage.id]
            const isDone = hasData && !isActive
            const isCurrent = hasData && isActive
            
            return (
              <button
                key={stage.id}
                onClick={() => setActiveNode(stage.id)}
                style={{
                  position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '16px',
                  padding: '16px', background: isActive ? '#1a1b1e' : 'transparent', border: `1px solid ${isActive ? '#3b82f6' : 'transparent'}`,
                  borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  marginBottom: '8px', opacity: !hasData && !isActive ? 0.5 : 1
                }}
              >
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px', background: isDone ? 'rgba(16,185,129,.1)' : isCurrent ? 'rgba(59,130,246,.1)' : '#1a1b1e',
                  border: `1px solid ${isDone ? 'rgba(16,185,129,.3)' : isCurrent ? 'rgba(59,130,246,.3)' : '#2a2c32'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDone ? '#10b981' : isCurrent ? '#3b82f6' : '#565b63', flexShrink: 0
                }}>
                  {isDone ? <CheckCircle2 size={20} /> : <Terminal size={20} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: isActive || hasData ? '#fff' : '#a0a5ab', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stage.title}
                    </div>
                    {isDone && <CheckCircle2 size={14} color="#10b981" />}
                    {isCurrent && <Play size={12} color="#3b82f6" />}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#565b63', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stage.owner_role}</div>
                    <div style={{ fontSize: '11px', color: '#a0a5ab', fontFamily: 'DM Mono, monospace' }}>{stage.estimated_time}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Task Execution Card */}
        <div style={{ flex: 1, background: '#111214', border: '1px solid #1e1f23', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column' }}>
          
          {/* Card Header */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #1e1f23', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Task Execution</div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>{activeStageDetails?.title || 'Execution Details'}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#a0a5ab' }}>Owner:</span>
              <span style={{ fontSize: '11px', background: 'rgba(59,130,246,.1)', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>{activeStageDetails?.owner_role || 'Unassigned'}</span>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
            
            {!stageData ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <Terminal size={32} color="#565b63" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>AI Execution Plan Pending</h3>
                <p style={{ color: '#a0a5ab', fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
                  The specific setup steps, tool requirements, and exact prompts for this custom stage have not been generated yet.
                </p>
                <button 
                  onClick={handleGenerateNode} 
                  disabled={generating}
                  style={{
                    background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px',
                    fontSize: '14px', fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  {generating ? <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%' }} /> : <Zap size={16} />}
                  {generating ? 'Generating AI Plan...' : 'Generate Step-by-Step AI Plan'}
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '14px', color: '#a0a5ab', lineHeight: '1.6', marginBottom: '32px' }}>
                  <strong style={{ color: '#e5e7eb' }}>Goal:</strong> {stageData.goal}
                </div>

            {/* AI Tools */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', color: '#565b63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Recommended AI Tools</div>
              <div style={{ display: 'flex', gap: '16px' }}>
                {stageData.tools.map((t: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1b1e', border: '1px solid #2a2c32', borderRadius: '8px', padding: '12px 16px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#2a2c32', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Terminal size={16} color="#e5e7eb" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: '#a0a5ab' }}>{t.desc || 'AI Tool'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              {/* Setup Guide */}
              <div>
                <div style={{ fontSize: '11px', color: '#565b63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Setup & Usage Guide</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stageData.setup.map((step: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', color: '#e5e7eb' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#1a1b1e', border: '1px solid #2a2c32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#a0a5ab', flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <span style={{ marginTop: '2px', lineHeight: '1.5' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rationale */}
              <div style={{ background: 'rgba(59,130,246,.05)', border: '1px solid rgba(59,130,246,.15)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Why these tools?</div>
                <div style={{ fontSize: '13px', color: '#a0a5ab', lineHeight: '1.6' }}>{stageData.why}</div>
              </div>
            </div>

            {/* Prompt Block */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', color: '#565b63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Exact Prompt</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ background: '#1a1b1e', border: '1px solid #2a2c32', color: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Copy size={12} /> Copy</button>
                  <a 
                    href={(() => {
                      const t = stageData.tools?.[0]?.name?.toLowerCase() || '';
                      if (t.includes('cursor')) return 'https://cursor.com';
                      if (t.includes('v0') || t.includes('vercel')) return 'https://v0.dev';
                      if (t.includes('groq')) return 'https://console.groq.com';
                      if (t.includes('gemini')) return 'https://aistudio.google.com';
                      if (t.includes('langchain')) return 'https://langchain.com';
                      if (t.includes('pinecone')) return 'https://pinecone.io';
                      if (t.includes('postman')) return 'https://postman.com';
                      if (t.includes('figma')) return 'https://figma.com';
                      if (t.includes('github') || t.includes('copilot')) return 'https://github.com';
                      return t ? `https://www.google.com/search?q=${encodeURIComponent(t + ' software tool')}` : '#';
                    })()}
                    target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', background: '#3b82f6', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Open Tool <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <textarea 
                defaultValue={stageData.prompt}
                style={{
                  width: '100%', minHeight: '160px', background: '#09090b', color: '#e5e7eb', padding: '20px',
                  borderRadius: '12px', border: '1px solid #2a2c32', fontSize: '13px', fontFamily: 'DM Mono, monospace',
                  lineHeight: '1.6', outline: 'none', resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              {/* Expected Output */}
              <div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} /> Expected Output</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#a0a5ab', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.5' }}>
                  {stageData.expected.map((ex: string, i: number) => <li key={i}>{ex}</li>)}
                </ul>
              </div>
              
              {/* Mistakes */}
              <div>
                <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={14} /> Common Mistakes</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#a0a5ab', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.5' }}>
                  {stageData.mistakes.map((m: string, i: number) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            </div>

            {/* Next Step */}
            <div style={{ background: '#1a1b1e', border: '1px solid #2a2c32', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#565b63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Next Recommended Step</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#e5e7eb' }}>{stageData.next}</div>
              </div>
              <ArrowRight color="#565b63" />
            </div>
              </>
            )}

          </div>
        </div>

      </div>

    </div>
  )
}
