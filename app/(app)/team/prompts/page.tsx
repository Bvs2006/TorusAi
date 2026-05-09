'use client'
import { useState } from 'react'
import { Terminal, Wand2, ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { AIProvider } from '@/lib/ai-router'

export default function PromptLab() {
  const [tab, setTab] = useState<'generate' | 'improve'>('improve')
  
  // Improve state
  const [weakPrompt, setWeakPrompt] = useState('')
  const [improveStack, setImproveStack] = useState('Next.js, Tailwind, TypeScript')
  
  // Generate state
  const [role, setRole] = useState('Frontend Developer')
  const [task, setTask] = useState('')
  const [genStack, setGenStack] = useState('Next.js, Tailwind, TypeScript')
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [meta, setMeta] = useState<any>(null)

  async function handleAction(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult('')
    setMeta(null)

    try {
      const payload = tab === 'improve' 
        ? { action: 'improve', prompt: weakPrompt, stack: improveStack }
        : { action: 'generate', role, task, stack: genStack }

      const res = await fetch('/api/team/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setResult(data.prompt)
      setMeta({ provider: data.ai_provider, model: data.ai_model })
    } catch (err: any) {
      alert(err.message || 'Failed to process prompt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '40px', height: '100%', alignItems: 'flex-start' }}>
      
      <div style={{ flex: 1, background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#172326', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={20} color="#f43f5e" /> Prompt Engineering Lab
        </h2>
        <p style={{ color: '#607276', fontSize: '13px', marginBottom: '24px' }}>
          Stop writing vague prompts. Let AI structure them perfectly for your exact tech stack and role.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(24,45,56,.04)', padding: '6px', borderRadius: '12px', marginBottom: '24px' }}>
          <button onClick={() => setTab('improve')} style={{ flex: 1, padding: '10px', background: tab === 'improve' ? '#fff' : 'transparent', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: tab === 'improve' ? 700 : 500, color: tab === 'improve' ? '#172326' : '#526977', cursor: 'pointer', transition: 'all 0.2s', boxShadow: tab === 'improve' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>
            Improve Prompt
          </button>
          <button onClick={() => setTab('generate')} style={{ flex: 1, padding: '10px', background: tab === 'generate' ? '#fff' : 'transparent', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: tab === 'generate' ? 700 : 500, color: tab === 'generate' ? '#172326' : '#526977', cursor: 'pointer', transition: 'all 0.2s', boxShadow: tab === 'generate' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>
            Generate from Task
          </button>
        </div>

        <form onSubmit={handleAction}>
          {tab === 'improve' ? (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#182d38', fontWeight: 600, marginBottom: '8px' }}>Weak Prompt</label>
                <textarea value={weakPrompt} onChange={e => setWeakPrompt(e.target.value)} required placeholder="e.g. Build a login page..." style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,.8)', border: '1px solid rgba(38,69,72,.15)', borderRadius: '12px', padding: '14px', color: '#172326', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#182d38', fontWeight: 600, marginBottom: '8px' }}>Context (Tech Stack)</label>
                <input value={improveStack} onChange={e => setImproveStack(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,.8)', border: '1px solid rgba(38,69,72,.15)', borderRadius: '10px', padding: '12px', color: '#172326', fontSize: '13px', outline: 'none' }} />
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#182d38', fontWeight: 600, marginBottom: '8px' }}>Role</label>
                  <input value={role} onChange={e => setRole(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,.8)', border: '1px solid rgba(38,69,72,.15)', borderRadius: '10px', padding: '12px', color: '#172326', fontSize: '13px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#182d38', fontWeight: 600, marginBottom: '8px' }}>Context (Tech Stack)</label>
                  <input value={genStack} onChange={e => setGenStack(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,.8)', border: '1px solid rgba(38,69,72,.15)', borderRadius: '10px', padding: '12px', color: '#172326', fontSize: '13px', outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#182d38', fontWeight: 600, marginBottom: '8px' }}>Task</label>
                <textarea value={task} onChange={e => setTask(e.target.value)} required placeholder="e.g. Implement user authentication..." style={{ width: '100%', minHeight: '80px', background: 'rgba(255,255,255,.8)', border: '1px solid rgba(38,69,72,.15)', borderRadius: '12px', padding: '14px', color: '#172326', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: '#172326',
            border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: loading ? 0.8 : 1, transition: 'all 0.2s'
          }}>
            {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%' }} /> : <Wand2 size={16} />}
            {tab === 'improve' ? 'Upgrade Prompt' : 'Generate Premium Prompt'}
          </button>
        </form>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {result ? (
          <div style={{ background: '#fff', border: '1px solid rgba(38,69,72,.1)', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', animation: 'fadeUp 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                <CheckCircle2 size={16} /> Ready to use
              </div>
              <button style={{ background: 'rgba(15,118,110,.1)', border: 'none', color: '#0f766e', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => navigator.clipboard.writeText(result)}>Copy to Clipboard</button>
            </div>
            
            <pre style={{
              background: '#172326', color: '#eef3f4', padding: '24px', borderRadius: '16px',
              fontSize: '13px', fontFamily: 'DM Mono, monospace', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0
            }}>
              {result}
            </pre>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(38,69,72,.1)', borderRadius: '24px', padding: '40px', textAlign: 'center', color: '#81919a' }}>
            <Terminal size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#526977', marginBottom: '8px' }}>Awaiting Generation</div>
            <div style={{ fontSize: '13px' }}>Your production-ready prompt will appear here.</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
