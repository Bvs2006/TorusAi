'use client'
import { useState } from 'react'
import { Box, Code, Layers, Layout, MessageSquare, Terminal, Zap, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react'

const TOOLS = [
  { id: 'cursor', name: 'Cursor', category: 'IDE', icon: Terminal, desc: 'AI-first code editor for full refactoring.', freeTier: true, url: 'https://cursor.com' },
  { id: 'v0', name: 'v0 by Vercel', category: 'Frontend', icon: Layout, desc: 'Generative UI with React & Tailwind.', freeTier: true, url: 'https://v0.dev' },
  { id: 'langchain', name: 'LangChain', category: 'AI Pipeline', icon: Layers, desc: 'Framework for building LLM apps.', freeTier: true, url: 'https://langchain.com' },
  { id: 'groq', name: 'Groq', category: 'LLM API', icon: Zap, desc: 'Lightning-fast LPU inference engine.', freeTier: true, url: 'https://console.groq.com' },
  { id: 'gemini', name: 'Google Gemini', category: 'LLM API', icon: MessageSquare, desc: 'Multimodal AI with large context window.', freeTier: true, url: 'https://aistudio.google.com' },
  { id: 'pinecone', name: 'Pinecone', category: 'Vector DB', icon: Database, desc: 'Long-term memory for AI agents.', freeTier: true, url: 'https://pinecone.io' },
]

function Database(props: any) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
}

const TOOL_MODE_DATA: Record<string, any> = {
  cursor: {
    name: 'Cursor',
    bestFor: ['Large refactoring', 'Backend generation', 'Code understanding'],
    setup: [
      'Download from cursor.com',
      'Sign in with GitHub',
      'Open your existing project folder',
      'Press Cmd+L for Chat or Cmd+K for inline edits',
      'Enable Codebase Indexing in settings'
    ],
    prompt: `Generate scalable Express.js authentication system.
Use JWT, bcrypt, and PostgreSQL via Prisma.
Include standard security middleware (helmet, rate limiting).
Output exactly 3 files: routes, controller, middleware.`,
    workflow: 'Architecture -> Schema -> APIs -> Validation -> Testing',
    mistakes: ['Avoid generating entire backend in one prompt. Go file by file.']
  },
  groq: {
    name: 'Groq',
    bestFor: ['Real-time AI chat', 'Low-latency agent pipelines', 'Free Llama 3 inference'],
    setup: [
      'Go to console.groq.com and get an API key',
      'npm install @groq/groq-sdk',
      'Set GROQ_API_KEY in .env.local',
      'Initialize client in your backend router'
    ],
    prompt: `You are an expert coding assistant. Respond instantly to the user's query below.
Format output strictly as markdown. No preamble.`,
    workflow: 'API Key -> SDK Setup -> Route Handler -> Frontend Fetch',
    mistakes: ['Do not use for image generation or multimodal tasks (text only).']
  }
}

export default function AIToolEngine() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  
  const selectedData = activeTool ? (TOOL_MODE_DATA[activeTool] || TOOL_MODE_DATA['cursor']) : null

  return (
    <div style={{ display: 'flex', gap: '32px', height: '100%', position: 'relative' }}>
      
      {/* Tool Grid */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#172326', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="#f59e0b" /> AI Tool Directory
        </h2>
        <p style={{ color: '#607276', fontSize: '13px', marginBottom: '24px' }}>
          Stop guessing which AI tool to use. Select a tool to enter <strong>Tool Mode</strong> and see exactly how to operate it.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {TOOLS.map(tool => {
            const Icon = tool.icon
            const isActive = activeTool === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                style={{
                  background: isActive ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.54)',
                  border: `1px solid ${isActive ? '#0f766e' : 'rgba(38,69,72,.1)'}`,
                  borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.2s', boxShadow: isActive ? '0 12px 24px rgba(15,118,110,.1)' : '0 4px 12px rgba(0,0,0,0.02)',
                  transform: isActive ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(24,45,56,.04)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#172326' }}>
                    <Icon size={20} />
                  </div>
                  {tool.freeTier && <span style={{ fontSize: '10px', background: 'rgba(16,185,129,.1)', color: '#10b981', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>FREE TIER</span>}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172326', marginBottom: '4px' }}>{tool.name}</h3>
                <div style={{ fontSize: '11px', color: '#0891b2', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '8px' }}>{tool.category}</div>
                <p style={{ fontSize: '13px', color: '#526977', lineHeight: '1.4', margin: 0 }}>{tool.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tool Mode Panel */}
      {selectedData && (
        <div style={{ width: '400px', background: 'rgba(255,255,255,.8)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '24px', padding: '32px', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', animation: 'slideIn 0.3s ease' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: '#172326', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 800 }}>
                {selectedData.name[0]}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#172326', margin: 0 }}>{selectedData.name} Mode</h2>
            </div>
            
            {TOOLS.find(t => t.id === (activeTool || 'cursor'))?.url && (
              <a 
                href={TOOLS.find(t => t.id === (activeTool || 'cursor'))?.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', background: '#0f766e', color: '#fff', 
                  padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                Launch <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#526977', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Best Uses</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedData.bestFor.map((use: string, i: number) => (
                <span key={i} style={{ fontSize: '12px', background: 'rgba(15,118,110,.1)', color: '#0f766e', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>
                  {use}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(38,69,72,.1)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#526977', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Setup Guide</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedData.setup.map((step: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#172326' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(24,45,56,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#526977', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ marginTop: '2px' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#526977', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Premium Prompt Template</div>
            <div style={{ position: 'relative' }}>
              <pre style={{
                background: '#172326', color: '#eef3f4', padding: '20px', borderRadius: '16px',
                fontSize: '13px', fontFamily: 'DM Mono, monospace', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0
              }}>
                {selectedData.prompt}
              </pre>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.2)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
              <ShieldAlert color="#f59e0b" size={18} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>Mistakes to Avoid</div>
                <div style={{ fontSize: '13px', color: '#172326' }}>{selectedData.mistakes[0]}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(15,118,110,.05)', border: '1px solid rgba(15,118,110,.2)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 color="#0f766e" size={18} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f766e', marginBottom: '4px' }}>Standard Workflow</div>
                <div style={{ fontSize: '12px', color: '#172326', fontFamily: 'DM Mono, monospace' }}>{selectedData.workflow}</div>
              </div>
            </div>
          </div>

        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  )
}
