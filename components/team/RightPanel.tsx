'use client'
import { useTeam } from '@/app/(app)/team/TeamContext'
import { ArrowRight, Box, Code2, Cpu, Database, Lightbulb, Link as LinkIcon, MessageSquare, Terminal, Zap } from 'lucide-react'

export function RightPanel() {
  const { activeProject, activeRole, activeNode, nodeDataCache } = useTeam()

  if (!activeProject) return null

  const activeStageDetails = activeProject.custom_workflow_stages?.find((s: any) => s.id === activeNode)
  const nodeData = nodeDataCache[activeNode]

  return (
    <div style={{
      width: '320px', background: '#111214', borderLeft: '1px solid #1e1f23',
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)', color: '#e5e7eb',
      fontFamily: 'DM Sans, sans-serif', padding: '24px', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Zap size={18} color="#3b82f6" />
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>AI Context Guide</h2>
      </div>

      <div style={{ fontSize: '12px', color: '#a0a5ab', marginBottom: '24px', lineHeight: '1.5' }}>
        Context loaded for <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{activeStageDetails?.owner_role || activeRole}</span> working on stage: <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{activeStageDetails?.title || activeNode}</span>.
      </div>

      {/* Recommended Next Action */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#565b63', marginBottom: '12px' }}>Next Action</div>
        <div style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6', marginBottom: '4px' }}>{nodeData ? nodeData.next : 'Generate AI Plan'}</div>
          <div style={{ fontSize: '12px', color: '#a0a5ab', marginBottom: '12px' }}>{nodeData ? 'Proceed to the next logical step.' : 'Click the generate button in the main canvas to get step-by-step instructions.'}</div>
          {nodeData && (
            <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Open Prompt <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Recommended AI Tools */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#565b63', marginBottom: '12px' }}>AI Tool Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {nodeData ? nodeData.tools?.map((tool: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#1a1b1e', borderRadius: '8px', border: '1px solid #2a2c32' }}>
              <div style={{ width: '32px', height: '32px', background: '#2a2c32', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e5e7eb' }}>
                <Terminal size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb' }}>{tool.name}</div>
                <div style={{ fontSize: '11px', color: '#a0a5ab' }}>{tool.desc || 'AI Tool'}</div>
              </div>
            </div>
          )) : (
            <div style={{ fontSize: '12px', color: '#565b63', fontStyle: 'italic' }}>Generate plan to see tools.</div>
          )}
        </div>
      </div>

      {/* Dependency Warnings */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#565b63', marginBottom: '12px' }}>Dependencies</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'rgba(245,158,11,.1)', borderRadius: '8px', border: '1px solid rgba(245,158,11,.2)' }}>
          <LinkIcon size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>Waiting on Backend</div>
            <div style={{ fontSize: '12px', color: '#a0a5ab' }}>Auth APIs must be deployed before connecting the login form.</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#565b63', marginBottom: '12px' }}>Quick Actions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Generate Prompt', 'Improve Current Prompt', 'Create API Spec'].map((action, i) => (
            <button key={i} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'transparent', border: '1px solid #2a2c32', borderRadius: '6px', color: '#a0a5ab', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.color = '#e5e7eb'; e.currentTarget.style.borderColor = '#3b82f6'}} onMouseOut={e => {e.currentTarget.style.color = '#a0a5ab'; e.currentTarget.style.borderColor = '#2a2c32'}}>
              {action}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

// Inline fallback for the icon if it wasn't imported properly
function LayoutGrid(props: any) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
}
