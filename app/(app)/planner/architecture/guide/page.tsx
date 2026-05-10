import Link from 'next/link'
import { Terminal, Settings, Layout, Server, Database, Lock, Wand2, TestTube2, BookOpen, ChevronRight, LayoutList } from 'lucide-react'

const PHASES = [
  { name: 'Setup IDE', icon: Terminal, desc: 'Configure your code editor, workspace environment, and extensions.' },
  { name: 'Environment Setup', icon: Settings, desc: 'Initialize the framework, install dependencies, and setup env vars.' },
  { name: 'Frontend Development', icon: Layout, desc: 'Build out the responsive user interface and component architecture.' },
  { name: 'Backend Development', icon: Server, desc: 'Implement API routes, business logic, and server-side utilities.' },
  { name: 'Database Integration', icon: Database, desc: 'Set up schemas, perform migrations, and connect the data layer.' },
  { name: 'Authentication', icon: Lock, desc: 'Secure the application with user login, sessions, and access control.' },
  { name: 'AI Feature Integration', icon: Wand2, desc: 'Connect LLMs, vector databases, or AI APIs to your core logic.' },
  { name: 'Testing', icon: TestTube2, desc: 'Write and run unit, integration, and end-to-end tests.' },
  { name: 'Documentation', icon: BookOpen, desc: 'Finalize READMEs, inline comments, and developer guides.' }
]

export default function ArchitectureGuidePage({ searchParams }: { searchParams?: { project?: string } }) {
  const projectId = searchParams?.project || ''

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: -50, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(66,127,131,.08) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#427f83', marginBottom: '12px' }}>
            <LayoutList size={24} />
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>Workflow Planner</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#172326' }}>
            Development Guide
          </h1>
          <p style={{ color: '#607276', fontSize: '15px', marginTop: '10px', maxWidth: '600px', lineHeight: '1.6' }}>
            Follow these sequential phases to build your project from scratch. Each phase contains specific AI prompts and step-by-step instructions.
          </p>
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
                  padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.6)', 
                  border: '1px solid rgba(66,127,131,.15)', textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(66,127,131,.1), rgba(16,185,129,.1))', border: '1px solid rgba(66,127,131,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#427f83', flexShrink: 0 }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: '#8a9a9d', fontWeight: 600 }}>Phase {idx + 1}</span>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#172326' }}>
                        {phase.name}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#607276', lineHeight: '1.5' }}>
                      {phase.desc}
                    </p>
                  </div>
                </div>

                <div className="open-btn" style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                  background: '#f8fafc', color: '#427f83', borderRadius: '10px', 
                  fontSize: '13px', fontWeight: 700, transition: 'all 0.2s', border: '1px solid rgba(66,127,131,.1)'
                }}>
                  Open Phase <ChevronRight size={16} />
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(66,127,131,.1)', paddingTop: '30px' }}>
          <Link 
            href={`/planner/deploy?project=${projectId}`} 
            style={{ 
              padding: '14px 28px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', 
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
          background: #ffffff !important;
          border-color: rgba(66,127,131,.4) !important;
          box-shadow: 0 12px 32px rgba(66,127,131,.08);
          transform: translateY(-2px);
        }
        .phase-card:hover .open-btn {
          background: linear-gradient(135deg, #427f83, #83b9bd) !important;
          color: #ffffff !important;
          border-color: transparent !important;
        }
      `}</style>
    </div>
  )
}
