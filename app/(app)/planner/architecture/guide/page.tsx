'use client'
import Link from 'next/link'
import { Terminal, Settings, Layout, Server, Database, Lock, Wand2, TestTube2, BookOpen, ChevronRight, LayoutList } from 'lucide-react'

const PHASES = [
  { name: 'Setup IDE', icon: Terminal, desc: 'Prepare your editor, repo, extensions, and AI workspace before writing code.', outcome: 'Ready-to-code workspace', checks: ['Project opened in IDE', 'Git initialized', 'AI assistant configured'] },
  { name: 'Environment Setup', icon: Settings, desc: 'Create the app, install dependencies, and configure safe environment variables.', outcome: 'Running local app', checks: ['Dev server starts', '.env.local created', 'Dependencies installed'] },
  { name: 'Frontend Development', icon: Layout, desc: 'Build reusable layouts, pages, and components with responsive behavior.', outcome: 'Clickable UI flow', checks: ['Pages render', 'Mobile layout works', 'Components reused'] },
  { name: 'Backend Development', icon: Server, desc: 'Implement API routes, validation, business logic, and server utilities.', outcome: 'Stable API layer', checks: ['Routes tested', 'Errors handled', 'Inputs validated'] },
  { name: 'Database Integration', icon: Database, desc: 'Create schemas, connect the data layer, and verify read/write flows.', outcome: 'Persistent data flow', checks: ['Schema ready', 'Reads work', 'Writes work'] },
  { name: 'Authentication', icon: Lock, desc: 'Add login, sessions, route protection, and user-specific data access.', outcome: 'Secure user access', checks: ['Login works', 'Private routes protected', 'Session persists'] },
  { name: 'AI Feature Integration', icon: Wand2, desc: 'Connect AI providers through server routes with fallbacks and loading states.', outcome: 'Reliable AI feature', checks: ['API key secured', 'AI response shown', 'Fallback handled'] },
  { name: 'Testing', icon: TestTube2, desc: 'Verify core behavior with focused tests and manual user-flow checks.', outcome: 'Confidence before launch', checks: ['Core tests pass', 'Main flow checked', 'Edge cases reviewed'] },
  { name: 'Documentation', icon: BookOpen, desc: 'Write setup, usage, architecture, and deployment notes for future developers.', outcome: 'Submission-ready docs', checks: ['README complete', 'Env vars listed', 'Deploy steps clear'] }
]

export default function ArchitectureGuidePage({ searchParams }: { searchParams?: { project?: string } }) {
  const projectId = searchParams?.project || ''

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', position: 'relative', background: 'var(--bg)', minHeight: 'calc(100vh - 58px)' }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: -50, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(66,127,131,.08) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-teal)', marginBottom: '12px' }}>
            <LayoutList size={24} />
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>Workflow Planner</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: 'var(--text-heading)' }}>
            Development Guide
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '10px', maxWidth: '600px', lineHeight: '1.6' }}>
            Build your project one verified phase at a time. Each phase tells you what to prepare, what to build, how to use AI, and how to confirm the work is complete.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {[
            { title: '1. Prepare', text: 'Set up the exact files, tools, keys, and project context needed before prompting AI.' },
            { title: '2. Build', text: 'Use the ready-made prompt, then inspect and integrate the generated code carefully.' },
            { title: '3. Verify', text: 'Run the app, check the expected output, and mark the phase complete only when it works.' },
          ].map(item => (
            <div key={item.title} style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-teal)', marginBottom: '8px' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PHASES.map((phase, idx) => {
            const Icon = phase.icon
            return (
              <Link 
                key={phase.name} 
                href={`/planner/architecture/guide/step/${idx + 1}?project=${projectId}`}
                className="phase-card"
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '24px', borderRadius: '16px', background: 'var(--surface-overlay)', 
                  border: '1px solid var(--border-subtle)', textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'var(--glass-blur)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(66,127,131,.1)', border: '1px solid rgba(66,127,131,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', flexShrink: 0 }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle)', fontWeight: 600 }}>Phase {idx + 1}</span>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text-heading)' }}>
                        {phase.name}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {phase.desc}
                    </p>
                    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-teal)', background: 'rgba(66,127,131,.08)', padding: '5px 8px', borderRadius: '999px' }}>
                        Outcome: {phase.outcome}
                      </span>
                      {phase.checks.map(check => (
                        <span key={check} style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-2)', padding: '5px 8px', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>
                          {check}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="open-btn" style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                  background: 'var(--bg-3)', color: 'var(--accent-teal)', borderRadius: '10px', 
                  fontSize: '13px', fontWeight: 700, transition: 'all 0.2s', border: '1px solid var(--border-subtle)'
                }}>
                  Open Phase <ChevronRight size={16} />
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '30px' }}>
          <Link 
            href={`/planner/deploy?project=${projectId}`} 
            style={{ 
              padding: '14px 28px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', 
              border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'Syne, sans-serif', 
              fontSize: '15px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', 
              alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(66,127,131,.25)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Continue to Deployment Guide →
          </Link>
        </div>
      </div>

      <style>{`
        .phase-card:hover {
          background: var(--bg) !important;
          border-color: var(--accent-teal) !important;
          box-shadow: 0 12px 32px rgba(66,127,131,.12);
          transform: translateY(-2px);
        }
        .phase-card:hover .open-btn {
          background: linear-gradient(135deg, var(--accent-teal), var(--accent-cyan)) !important;
          color: #ffffff !important;
          border-color: transparent !important;
        }
      `}</style>
    </div>
  )
}
