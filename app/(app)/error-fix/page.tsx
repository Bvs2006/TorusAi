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
    width: '100%', background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)',
    borderRadius: '10px', padding: '10px 14px', color: '#172326', fontSize: '13px',
    outline: 'none', fontFamily: 'DM Mono, monospace', transition: 'border-color 0.15s'
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '820px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🔧 Error Fix Assistant
        </h1>
        <p style={{ color: '#607276', fontSize: '13px' }}>
          Paste any error message. Get a plain-English explanation, debug steps, and a ready-to-use fix prompt for Cursor or Windsurf.
        </p>
      </div>

      {/* Examples */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', alignSelf: 'center' }}>Try example:</span>
        {EXAMPLE_ERRORS.map(ex => (
          <button key={ex.label} onClick={() => loadExample(ex)} style={{
            padding: '5px 12px', background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)',
            borderRadius: '20px', color: '#607276', fontSize: '11px', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', transition: 'all 0.15s'
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#427f83'; e.currentTarget.style.color = '#83b9bd' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(38,69,72,.12)'; e.currentTarget.style.color = '#607276' }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleFix}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '12px', marginBottom: '12px' }}>
          {/* Error textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#607276', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
              Error Message *
            </label>
            <textarea
              value={errorText}
              onChange={e => setErrorText(e.target.value)}
              placeholder="Paste your full error message here including stack trace..."
              rows={7}
              style={{ ...inputBase, resize: 'vertical' as const }}
              onFocus={e => (e.target.style.borderColor = '#427f83')}
              onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.12)')}
            />
          </div>
          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#607276', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                Language / Framework
              </label>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                style={{ ...inputBase, fontFamily: 'DM Sans, sans-serif' }}>
                {['TypeScript/Next.js', 'JavaScript/React', 'Python/Django', 'Python/FastAPI',
                  'Node.js/Express', 'TypeScript/NestJS', 'Supabase / PostgreSQL',
                  'React Native / Expo', 'Go', 'Rust'].map(l => (
                    <option key={l} value={l} style={{ background: 'rgba(255,255,255,.62)' }}>{l}</option>
                  ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#607276', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                Context (optional)
              </label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="What were you trying to do when this happened?"
                rows={4}
                style={{ ...inputBase, resize: 'none' as const }}
                onFocus={e => (e.target.style.borderColor = '#427f83')}
                onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.12)')}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading || !errorText.trim()} style={{
          padding: '11px 28px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', border: 'none', borderRadius: '10px',
          color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 800,
          cursor: loading || !errorText.trim() ? 'not-allowed' : 'pointer',
          opacity: !errorText.trim() ? 0.5 : 1,
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 18px rgba(66,127,131,.3)'
        }}>
          {loading ? (
            <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Analyzing error...</>
          ) : (
            <><Zap size={14} /> Analyze & Fix</>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeUp 0.4s ease both' }}>
          {/* Explanation */}
          <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💡 What went wrong
            </div>
            <p style={{ color: '#607276', fontSize: '13px', lineHeight: '1.7' }}>{result.explanation}</p>
          </div>

          {/* Debug steps */}
          <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              🔍 Debug Steps
            </div>
            {result.steps?.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', background: 'rgba(66,127,131,.2)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#83b9bd', flexShrink: 0, marginTop: '1px' }}>
                  {i + 1}
                </div>
                <p style={{ color: '#607276', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Fixed prompt */}
          <div style={{ background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,.62)', borderBottom: '1px solid rgba(38,69,72,.1)' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✨ Fixed Prompt
                <span style={{ fontSize: '11px', color: '#607276', fontFamily: 'DM Mono, monospace', fontWeight: 400 }}>
                  — paste into Cursor or Windsurf
                </span>
              </div>
              <button onClick={() => copyText(result.fixedPrompt, 'prompt')} style={{
                padding: '6px 12px', background: copied === 'prompt' ? 'rgba(16,185,129,.2)' : 'rgba(66,127,131,.2)',
                border: `1px solid ${copied === 'prompt' ? 'rgba(16,185,129,.4)' : 'rgba(66,127,131,.28)'}`,
                borderRadius: '7px', color: copied === 'prompt' ? '#10b981' : '#83b9bd',
                fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'DM Mono, monospace'
              }}>
                {copied === 'prompt' ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <pre style={{ padding: '16px', fontSize: '12px', color: '#83b9bd', fontFamily: 'DM Mono, monospace', lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
              {result.fixedPrompt}
            </pre>
          </div>

          {result.relatedDocs && (
            <div style={{ fontSize: '12px', color: '#607276' }}>
              📚 Related docs:{' '}
              <a href={result.relatedDocs} target="_blank" rel="noopener noreferrer"
                style={{ color: '#5aa0a4', textDecoration: 'none' }}>
                {result.relatedDocs}
              </a>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
