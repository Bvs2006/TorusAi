'use client'
// app/(app)/error-fix/page.tsx
import { useState } from 'react'
import { Copy, Check, Zap } from 'lucide-react'
import { showToast } from '@/components/ui'

const EXAMPLE_ERRORS = [
  {
    label: 'Next.js hydration error',
    error: `Error: Hydration failed because the initial UI does not match what was rendered on the server.
Warning: Expected server HTML to contain a matching <div> in <div>.
at div
at Providers (webpack-internal:///./src/providers.tsx:15)`,
    lang: 'Next.js 14'
  },
  {
    label: 'Supabase RLS error',
    error: `PostgrestError: new row violates row-level security policy for table "projects"
Code: 42501
Details: {}
Hint: null
Message: new row violates row-level security policy for table "projects"`,
    lang: 'Supabase / PostgreSQL'
  },
  {
    label: 'TypeScript cannot find module',
    error: `Error: Cannot find module '@/components/Button' or its corresponding type declarations.
  at Object.pathToFileURL (/usr/local/lib/node_modules/ts-node/src/util.ts:50:15)
ts(2307)`,
    lang: 'TypeScript'
  },
]

export default function ErrorFixPage() {
  const [errorText, setErrorText] = useState('')
  const [language, setLanguage] = useState('TypeScript/Next.js')
  const [context, setContext] = useState('')
  const [result, setResult] = useState<{ explanation: string; steps: string[]; fixedPrompt: string; relatedDocs?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleFix(e: React.FormEvent) {
    e.preventDefault()
    if (!errorText.trim()) { showToast('⚠️ Paste an error message first'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorText, language, context })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      showToast('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  function loadExample(ex: typeof EXAMPLE_ERRORS[0]) {
    setErrorText(ex.error)
    setLanguage(ex.lang)
    setContext('')
    setResult(null)
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    showToast('✓ Copied!')
    setTimeout(() => setCopied(null), 2500)
  }

  const inputBase: React.CSSProperties = {
    width: '100%', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)',
    borderRadius: '12px', padding: '12px 16px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', fontFamily: 'var(--font-mono), monospace', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'var(--glass-blur)'
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '820px', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
          🔧 Error Fix Assistant
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
          Paste any error message. Get a plain-English explanation, debug steps, and a ready-to-use fix prompt for Cursor or Windsurf.
        </p>
      </div>

      {/* Examples */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace', alignSelf: 'center' }}>Try example:</span>
        {EXAMPLE_ERRORS.map(ex => (
          <button key={ex.label} onClick={() => loadExample(ex)} style={{
            padding: '6px 14px', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)',
            borderRadius: '20px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', transition: 'all 0.2s'
          }}
            className="example-btn"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleFix}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '16px', marginBottom: '16px' }}>
          {/* Error textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 600 }}>
              Error Message *
            </label>
            <textarea
              value={errorText}
              onChange={e => setErrorText(e.target.value)}
              placeholder="Paste your full error message here including stack trace..."
              rows={8}
              style={{ ...inputBase, resize: 'vertical' as const }}
              className="error-textarea"
            />
          </div>
          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 600 }}>
                Language / Framework
              </label>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                style={{ ...inputBase, fontFamily: 'DM Sans, sans-serif' }}
                className="language-select"
              >
                {['TypeScript/Next.js', 'JavaScript/React', 'Python/Django', 'Python/FastAPI',
                  'Node.js/Express', 'TypeScript/NestJS', 'Supabase / PostgreSQL',
                  'React Native / Expo', 'Go', 'Rust'].map(l => (
                    <option key={l} value={l} style={{ background: 'var(--surface)', color: 'var(--text)' }}>{l}</option>
                  ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 600 }}>
                Context (optional)
              </label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="What were you trying to do?"
                rows={5}
                style={{ ...inputBase, resize: 'none' as const }}
                className="error-textarea"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading || !errorText.trim()} style={{
          padding: '12px 32px', 
          background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', 
          border: 'none', borderRadius: '12px',
          color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 800,
          cursor: loading || !errorText.trim() ? 'not-allowed' : 'pointer',
          opacity: !errorText.trim() ? 0.5 : 1,
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 8px 24px rgba(66,127,131,0.25)',
          transition: 'all 0.2s'
        }}
        onMouseOver={e => !loading && errorText.trim() && (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {loading ? (
            <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Analyzing error...</>
          ) : (
            <><Zap size={16} strokeWidth={2.5} /> Analyze & Fix Error</>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeUp 0.4s ease both' }}>
          {/* Explanation */}
          <div style={{ background: 'var(--surface-glass)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-heading)' }}>
              💡 What went wrong
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>{result.explanation}</p>
          </div>

          {/* Debug steps */}
          <div style={{ background: 'var(--surface-glass)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-heading)' }}>
              🔍 Debug Steps
            </div>
            {result.steps?.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '26px', height: '26px', background: 'var(--focus)', border: '1px solid var(--border-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--primary)', flexShrink: 0, fontWeight: 700 }}>
                  {i + 1}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingTop: '2px' }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Fixed prompt */}
          <div style={{ background: 'var(--surface-overlay)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--hover-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--surface-glass)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-heading)' }}>
                ✨ Fixed Prompt
                <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace', fontWeight: 400 }}>
                  — paste into Cursor or Windsurf
                </span>
              </div>
              <button onClick={() => copyText(result.fixedPrompt, 'prompt')} style={{
                padding: '8px 16px', background: copied === 'prompt' ? 'rgba(16,185,129,.1)' : 'var(--focus)',
                border: `1px solid ${copied === 'prompt' ? 'var(--success)' : 'var(--border-subtle)'}`,
                borderRadius: '8px', color: copied === 'prompt' ? 'var(--success)' : 'var(--primary)',
                fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: 'DM Mono, monospace', fontWeight: 600, transition: 'all 0.2s'
              }}>
                {copied === 'prompt' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <pre style={{ 
              padding: '24px', 
              fontSize: '13px', 
              color: 'var(--text)', 
              fontFamily: 'var(--font-mono), monospace', 
              lineHeight: '1.8', 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word', 
              margin: 0,
              background: 'var(--surface-overlay)'
            }}>
              {result.fixedPrompt}
            </pre>
          </div>

          {result.relatedDocs && (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              📚 Related docs:
              <a href={result.relatedDocs} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 600 }}>
                {result.relatedDocs}
              </a>
            </div>
          )}
        </div>
      )}
      <style>{`
        .example-btn:hover { border-color: var(--accent-teal) !important; color: var(--text-heading) !important; background: var(--surface-glass-hover) !important; }
        .error-textarea:focus { border-color: var(--accent-teal) !important; box-shadow: 0 0 0 3px var(--focus) !important; }
        .language-select:focus { border-color: var(--accent-teal) !important; box-shadow: 0 0 0 3px var(--focus) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
