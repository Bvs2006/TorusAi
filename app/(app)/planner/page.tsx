'use client'
import { auth } from '@/utils/firebase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowUp, Briefcase, Cpu, Layers, Wand2, Globe, Smartphone, Server, Bot, CheckCircle2 } from 'lucide-react'
import { showToast } from '@/components/ui'

const SUGGESTIONS = [
  'A real-time AI collaborative canvas with multi-user presence and vector search',
  'An automated developer telemetry dashboard with error alerts and LLM diagnostics',
  'A mobile-first habit tracker with daily streaks, Firebase sync, and milestone badges',
  'An autonomous research agent MCP server for Cursor and Claude Desktop',
]

const PLATFORMS = [
  { id: 'web', label: 'Web App', icon: Globe },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  { id: 'api', label: 'API / Backend', icon: Server },
  { id: 'mcp', label: 'MCP Server', icon: Bot },
]

export default function PlannerPage() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [experience, setExperience] = useState('intermediate')
  const [platform, setPlatform] = useState('web')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim()) return
    setLoading(true)

    try {
      const user = auth.currentUser
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, experience, platform, userId: user?.uid || null })
      })
      const plan = await res.json()
      if (plan.error) throw new Error(plan.error)
      showToast('✓ Architecture plan generated! Moving to feature breakdown...')
      router.push(`/planner/features?project=${plan.projectId}`)
    } catch (err: any) {
      showToast(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-58px)] bg-neutral-50 dark:bg-[#08080c] text-neutral-900 dark:text-white/90 selection:bg-purple-500/30 selection:text-white flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Ambient Radial Mesh Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-600/20 dark:via-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 dark-grid-pattern opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/20 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-4">
          <Wand2 size={13} className="text-purple-600 dark:text-purple-400" />
          <span>Search-Grounded Architecture Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 dark:text-white tracking-tight mb-4 leading-tight">
          Let&apos;s build something <br />
          <span className="italic font-light text-neutral-700 dark:text-white/90">extraordinary.</span>
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Describe your product vision. Torus queries live web benchmarks to design the optimal tech stack, 7-phase roadmap, and AI IDE prompts.
        </p>
      </div>

      {/* Main Interactive Prompt Console */}
      <form
        onSubmit={handleGenerate}
        className="w-full max-w-3xl relative z-10"
      >
        <div className={`bg-white dark:bg-[#0c0d15] border rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-all duration-300 ${
          focused
            ? 'border-purple-500/60 shadow-purple-500/10 shadow-2xl'
            : 'border-neutral-200/90 dark:border-white/10'
        }`}>
          
          {/* Status Indicator Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-white/[0.06] text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Groq Llama 3.3 70B · SearXNG Grounded</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
              Zero-Cost Plan
            </span>
          </div>

          {/* Textarea Input */}
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Describe what you want to build (e.g., 'An AI code review agent that scans GitHub PRs, checks against architecture rules, and posts automated feedback using Next.js and Groq')..."
            rows={5}
            className="w-full bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm sm:text-base outline-none resize-none leading-relaxed font-sans"
            autoFocus
          />

          {/* Configuration Row */}
          <div className="pt-6 mt-4 border-t border-neutral-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            {/* Platform & Experience Selectors */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Target Platform */}
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 font-medium">
                  Platform
                </span>
                <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-white/[0.04] p-1 rounded-xl border border-neutral-200/80 dark:border-white/5">
                  {PLATFORMS.map(p => {
                    const active = platform === p.id
                    const Icon = p.icon
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          active
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <Icon size={12} /> {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 font-medium">
                  Experience
                </span>
                <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-white/[0.04] p-1 rounded-xl border border-neutral-200/80 dark:border-white/5">
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => {
                    const active = experience === lvl.toLowerCase()
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setExperience(lvl.toLowerCase())}
                        className={`text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                          active
                            ? 'bg-purple-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="w-12 h-12 rounded-2xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-all shadow-md hover:scale-105"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-white dark:border-t-black rounded-full animate-spin" />
              ) : (
                <ArrowUp size={20} strokeWidth={2.5} />
              )}
            </button>

          </div>

        </div>

        {/* Suggestion Chips */}
        <div className="mt-5 space-y-2">
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest pl-2 block">
            Sample Project Concepts:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdea(s)}
                className="text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.08] border border-neutral-200/80 dark:border-white/[0.08] hover:border-purple-500/40 px-3.5 py-2 rounded-xl transition-all text-left shadow-sm dark:shadow-none"
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        </div>

      </form>

    </div>
  )
}
