'use client'
// app/(app)/error-fix/page.tsx
import { useState } from 'react'
import { Copy, Check, Zap, Terminal, Sparkles, AlertCircle, BookOpen, ArrowRight, CornerDownRight } from 'lucide-react'
import { showToast } from '@/components/ui'

const EXAMPLE_ERRORS = [
  {
    label: 'Next.js 14 Hydration',
    error: `Error: Hydration failed because the initial UI does not match what was rendered on the server.
Warning: Expected server HTML to contain a matching <div> in <div>.
at div
at Providers (webpack-internal:///./src/providers.tsx:15)`,
    lang: 'TypeScript/Next.js',
    context: 'Server components rendering dynamic date vs client'
  },
  {
    label: 'Firebase RLS Permission',
    error: `PostgrestError: new row violates row-level security policy for table "projects"
Code: 42501
Details: {}
Hint: null
Message: new row violates row-level security policy for table "projects"`,
    lang: 'Firebase / Firestore',
    context: 'Inserting document with unauthenticated UID'
  },
  {
    label: 'TypeScript Module Path',
    error: `Error: Cannot find module '@/components/Button' or its corresponding type declarations.
  at Object.pathToFileURL (/usr/local/lib/node_modules/ts-node/src/util.ts:50:15)
ts(2307)`,
    lang: 'TypeScript/Next.js',
    context: 'tsconfig path alias resolution'
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
    setContext(ex.context)
    setResult(null)
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    showToast('✓ Copied to clipboard!')
    setTimeout(() => setCopied(null), 2500)
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto text-neutral-900 dark:text-white/90 font-sans selection:bg-purple-500/30 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER
          ───────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-3">
          <Terminal size={12} className="text-purple-500 dark:text-purple-400" />
          <span>Intelligent Code Diagnostics</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-normal text-neutral-900 dark:text-white tracking-tight mb-3">
          Error Fix Assistant
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Paste terminal outputs, compile-time errors, or unhandled exceptions. Torus analyzes root causes, provides step-by-step debug actions, and authors an exact fix prompt ready for your AI IDE.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EXAMPLES BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5 mb-6 bg-white/[0.02] border border-white/[0.06] p-3 rounded-2xl">
        <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 pl-2">
          <Sparkles size={12} className="text-purple-400" /> Quick Examples:
        </span>
        {EXAMPLE_ERRORS.map(ex => (
          <button
            key={ex.label}
            onClick={() => loadExample(ex)}
            className="text-xs font-mono text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded-full transition-all"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN FORM / CODE INPUT
          ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleFix} className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Terminal Code Window */}
          <div className="lg:col-span-8 bg-[#0c0d15] border border-white/10 rounded-2xl overflow-hidden shadow-2xl focus-within:border-purple-500/50 transition-colors">
            {/* Terminal Window Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-neutral-400 ml-2">error_trace.log</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                Stack Trace
              </span>
            </div>

            <textarea
              value={errorText}
              onChange={e => setErrorText(e.target.value)}
              placeholder="Paste terminal error, build log, or runtime exception here..."
              rows={9}
              className="w-full bg-transparent p-4 text-xs sm:text-sm font-mono text-neutral-200 placeholder-neutral-600 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Configuration Sidebar */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-[#0c0d15] border border-white/10 rounded-2xl p-5 shadow-2xl">
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  Runtime / Framework
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full bg-[#141522] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500 font-sans"
                >
                  {['TypeScript/Next.js', 'JavaScript/React', 'Python/Django', 'Python/FastAPI',
                    'Node.js/Express', 'TypeScript/NestJS', 'Firebase / Firestore',
                    'React Native / Expo', 'Go', 'Rust'].map(l => (
                    <option key={l} value={l} className="bg-[#0c0d15] text-white">{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  Context / Action (Optional)
                </label>
                <textarea
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="What code or CLI command were you running?"
                  rows={4}
                  className="w-full bg-[#141522] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-600 outline-none resize-none focus:border-purple-500 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !errorText.trim()}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl transition-all shadow-md hover:shadow-white/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                  <span>Analyzing Stack Trace...</span>
                </>
              ) : (
                <>
                  <Zap size={15} className="fill-black" />
                  <span>Analyze & Author Fix</span>
                </>
              )}
            </button>

          </div>

        </div>

      </form>

      {/* ─────────────────────────────────────────────────────────────
          4. RESULTS PRESENTATION
          ───────────────────────────────────────────────────────────── */}
      {result && (
        <div className="mt-12 space-y-6 animate-fade-up">
          
          {/* Explanation Card */}
          <div className="bg-[#0c0d15] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-3 text-purple-300">
              <AlertCircle size={18} />
              <h3 className="text-base font-semibold text-white">Root Cause Analysis</h3>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Debug Steps Card */}
          <div className="bg-[#0c0d15] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Resolution Steps
            </h3>
            <div className="space-y-3">
              {result.steps?.map((step, i) => (
                <div key={i} className="flex items-start gap-3.5 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Prompt Card (The Core Value) */}
          <div className="bg-[#0c0d15] border border-purple-500/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-purple-500/10 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-sm font-semibold text-white">Tailored IDE Fix Prompt</span>
                <span className="hidden sm:inline text-xs font-mono text-purple-300/70">
                  — Copy & paste directly into Cursor or Windsurf
                </span>
              </div>
              <button
                onClick={() => copyText(result.fixedPrompt, 'prompt')}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-all shadow-sm"
              >
                {copied === 'prompt' ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy Prompt</>}
              </button>
            </div>

            <pre className="p-6 text-xs sm:text-sm font-mono text-purple-200/90 bg-[#08080d] leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {result.fixedPrompt}
            </pre>
          </div>

          {/* Docs Link */}
          {result.relatedDocs && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
              <BookOpen size={14} className="text-purple-400" />
              <span>Official Documentation:</span>
              <a
                href={result.relatedDocs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-white underline font-mono flex items-center gap-1"
              >
                {result.relatedDocs}
              </a>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
