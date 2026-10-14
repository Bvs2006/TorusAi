'use client'

import { collection, getDocs, doc, getDoc, query, where, updateDoc } from 'firebase/firestore'
import { db } from '@/utils/firebase/client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { showToast } from '@/components/ui'
import {
  Copy,
  Check,
  RefreshCw,
  Zap,
  Bot,
  ArrowRight,
  Folder,
  Database,
  CheckCircle2,
  FileCode,
  CheckSquare,
  Wrench,
  HelpCircle,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Terminal,
  Layers,
  ArrowLeft,
  Flame,
  Clock,
  Code2
} from 'lucide-react'
import type { Project, Phase } from '@/types'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

const TOOLS = [
  { name: 'Cursor', icon: '⚡', url: 'cursor://open' },
  { name: 'Windsurf', icon: '🌊', url: 'windsurf://open' },
  { name: 'Bolt.new', icon: '🔩', url: 'https://bolt.new' },
  { name: 'Lovable', icon: '❤️', url: 'https://lovable.dev' },
  { name: 'Replit', icon: '🌀', url: 'https://replit.com/new' },
]

function WorkspaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const [project, setProject] = useState<Project | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])
  const [activePhase, setActivePhase] = useState(0)
  const [selectedTool, setSelectedTool] = useState('Cursor')
  const [prompt, setPrompt] = useState('')
  const [tips, setTips] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showRobot, setShowRobot] = useState(false)
  const [errorLog, setErrorLog] = useState('')
  const [fixing, setFixing] = useState(false)

  useEffect(() => {
    if (!projectId) {
      router.push('/planner')
      return
    }
    loadData()
  }, [projectId])

  async function loadData() {
    try {
      const [projSnap, phasesSnap] = await Promise.all([
        getDoc(doc(db as any, 'projects', projectId!)),
        getDocs(query(collection(db as any, 'phases'), where('project_id', '==', projectId)))
      ])

      if (!projSnap.exists()) {
        router.push('/dashboard')
        return
      }

      const proj = { id: projSnap.id, ...projSnap.data() as any }
      const phaseData = phasesSnap.docs
        .map((d: any) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => a.phase_number - b.phase_number)

      setProject(proj as any)
      setPhases(phaseData as any)

      if (phaseData && phaseData.length > 0) {
        if ((phaseData[0] as any).prompt) {
          setPrompt((phaseData[0] as any).prompt)
        } else {
          generatePrompt(proj as any, phaseData[0] as any, 'Cursor')
        }
      }
    } catch (err) {
      console.error('Error loading workspace data:', err)
      showToast('Error loading project data')
    } finally {
      setLoading(false)
    }
  }

  async function generatePrompt(proj: Project, phase: Phase, tool: string) {
    setGenerating(true)
    try {
      const featSnap = await getDocs(query(collection(db as any, 'features'), where('project_id', '==', proj.id)))
      const features = featSnap.docs.map((d: any) => d.data())
      const res = await fetch('/api/ai/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          tool,
          stack: proj.stack,
          projectIdea: proj.idea,
          features: features.map((f: any) => f.name) || [],
          experience: proj.experience
        })
      })
      const data = await res.json()
      setPrompt(data.prompt || '')
      setTips(data.tips || [])
      await updateDoc(doc(db as any, 'phases', phase.id), { prompt: data.prompt })
    } catch (err) {
      showToast('Failed to generate prompt. Try again.')
    }
    setGenerating(false)
  }

  async function selectPhase(idx: number) {
    setActivePhase(idx)
    setCopied(false)
    const phase = phases[idx]
    if (!phase || !project) return
    if (phase.prompt && selectedTool === 'Cursor') {
      setPrompt(phase.prompt)
    } else {
      generatePrompt(project, phase, selectedTool)
    }
  }

  async function switchTool(tool: string) {
    setSelectedTool(tool)
    setCopied(false)
    const phase = phases[activePhase]
    if (phase && project) generatePrompt(project, phase, tool)
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    showToast('✓ Master prompt copied to clipboard!')
    setTimeout(() => setCopied(false), 3000)
  }

  async function markDone() {
    const current = phases[activePhase]
    if (!current) return
    await updateDoc(doc(db as any, 'phases', current.id), { status: 'done', completed_at: new Date().toISOString() })
    setPhases(prev => prev.map(p => p.id === current.id ? { ...p, status: 'done' } : p))
    showToast('🎉 Milestone verified & saved!')
    if (activePhase < phases.length - 1) selectPhase(activePhase + 1)
  }

  async function openInTool(toolName: string) {
    const toolObj = TOOLS.find(t => t.name === toolName)
    await navigator.clipboard.writeText(prompt)
    showToast(`✓ Prompt copied! Opening ${toolName}...`)
    window.open(toolObj?.url || 'https://bolt.new', '_blank')
  }

  async function generateFixPrompt() {
    if (!errorLog) return
    setFixing(true)
    try {
      const res = await fetch('/api/ai/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: errorLog,
          context: `Fixing an error while working on Phase ${phases[activePhase]?.phase_number}: ${phases[activePhase]?.name}`,
          stack: project?.stack,
        })
      })
      const data = await res.json()
      if (data.fixedPrompt) {
        setPrompt(data.fixedPrompt)
        setShowRobot(false)
        setErrorLog('')
        showToast('✓ Fix prompt generated!')
      } else {
        showToast('Failed to generate fix prompt.')
      }
    } catch (err) {
      showToast('Error generating fix prompt.')
    }
    setFixing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#08080c] flex items-center justify-center p-6 text-neutral-600 dark:text-neutral-400 font-mono text-sm">
        <div className="w-6 h-6 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin mr-3" />
        <span>Initializing Architecture Cockpit...</span>
      </div>
    )
  }

  const currentPhase = phases[activePhase]
  const completedCount = phases.filter(p => p.status === 'done').length
  const progressPercent = phases.length ? Math.round((completedCount / phases.length) * 100) : 0

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-neutral-100 dark:bg-[#08080c] text-neutral-900 dark:text-white/90 font-sans selection:bg-purple-500/30 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. COCKPIT TOP COMMAND BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="h-14 bg-white/90 dark:bg-[#0c0d15]/90 border-b border-neutral-200/80 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 backdrop-blur-xl z-30">
        
        {/* Left: Brand + Project Identity */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </Link>

          <div className="w-[1px] h-4 bg-neutral-200 dark:bg-white/10" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h1 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
              {project?.name || 'Architecture Workspace'}
            </h1>
            <span className="hidden md:inline text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 shrink-0">
              {project?.platform || 'Web'}
            </span>
          </div>
        </div>

        {/* Center: Live Roadmap Telemetry */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-32 bg-neutral-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {completedCount}/{phases.length} Phases ({progressPercent}%)
          </span>
        </div>

        {/* Right: Quick Actions + Theme */}
        <div className="flex items-center gap-3">
          <ThemeToggle collapsed={true} />
          
          <button
            onClick={() => openInTool(selectedTool)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <ExternalLink size={13} />
            <span>Open in {selectedTool}</span>
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
            title="Exit Cockpit"
          >
            <LogOut size={16} />
          </button>
        </div>

      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. THREE-PANE ARCHITECTURE COCKPIT
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ── LEFT PANE: 7-PHASE ROADMAP (col-span-3) ── */}
        <aside className="lg:col-span-3 bg-white/70 dark:bg-[#0c0d15]/60 border-r border-neutral-200/80 dark:border-white/10 p-4 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200/60 dark:border-white/5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Phase Navigator
              </span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                Live Roadmap
              </span>
            </div>

            <div className="space-y-2">
              {phases.map((phase, i) => {
                const isActive = activePhase === i
                const isDone = phase.status === 'done'

                return (
                  <button
                    key={phase.id}
                    onClick={() => selectPhase(i)}
                    className={`w-full text-left p-3 rounded-xl border transition-all relative flex items-start gap-3 ${
                      isActive
                        ? 'bg-purple-50/80 dark:bg-purple-500/10 border-purple-500/50 shadow-md shadow-purple-500/5'
                        : isDone
                        ? 'bg-neutral-50/80 dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/5 text-neutral-500 hover:border-neutral-300 dark:hover:border-white/20'
                        : 'bg-transparent border-transparent hover:bg-neutral-100/80 dark:hover:bg-white/[0.03] text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {/* Status Circle / Checkmark */}
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : isActive ? (
                        <div className="w-4 h-4 rounded-full border-2 border-purple-500 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-400 dark:border-neutral-600 flex items-center justify-center text-[9px] font-mono">
                          {phase.phase_number}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-semibold truncate ${
                        isActive ? 'text-purple-700 dark:text-purple-300' : isDone ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'
                      }`}>
                        Phase {phase.phase_number}: {phase.name}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {isDone ? 'Completed' : isActive ? 'Active Phase' : phase.duration || '2-3h build'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200/60 dark:border-white/5 text-center">
            <Link
              href={`/planner/architecture?project=${projectId}`}
              className="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View Full Visual Diagram</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </aside>

        {/* ── CENTER PANE: EXECUTION TERMINAL & PROMPT (col-span-6) ── */}
        <main className="lg:col-span-6 bg-white dark:bg-[#08080c] p-6 overflow-y-auto space-y-6 relative">
          
          {/* Phase Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-bold">
                  Step {currentPhase?.phase_number} of {phases.length}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {currentPhase?.duration || 'Estimated: 2h'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 dark:text-white">
                {currentPhase?.name}
              </h2>
            </div>

            {/* Validation CTA */}
            <button
              onClick={markDone}
              disabled={currentPhase?.status === 'done'}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                currentPhase?.status === 'done'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{currentPhase?.status === 'done' ? 'Milestone Complete' : 'Mark Milestone Done'}</span>
            </button>
          </div>

          {/* AI IDE Target Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              Generate Prompt Tailored For:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {TOOLS.map(t => {
                const active = selectedTool === t.name
                return (
                  <button
                    key={t.name}
                    onClick={() => switchTool(t.name)}
                    className={`text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 border transition-all ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 font-semibold shadow-sm'
                        : 'bg-neutral-50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-purple-400'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Master Prompt Console */}
          <div className="bg-neutral-900 text-neutral-100 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
            {/* Console Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-neutral-400 ml-2">master_prompt_{selectedTool.toLowerCase()}.md</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyPrompt}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Body */}
            <div className="p-4 sm:p-6 max-h-80 overflow-y-auto font-mono text-xs leading-relaxed text-neutral-200">
              {generating ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-6 h-6 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-neutral-400">Crafting optimal prompt for {selectedTool}...</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono break-words">
                  {prompt || 'Select a phase to generate an AI builder prompt.'}
                </pre>
              )}
            </div>

            {/* Prompt Actions Footer */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-3 text-xs font-mono">
              <span className="text-neutral-500">
                Optimized for code adherence & test passing
              </span>
              <button
                onClick={() => openInTool(selectedTool)}
                className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
              >
                <span>Launch in {selectedTool}</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          {/* Process Guide / Steps */}
          <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles size={15} className="text-purple-500" />
              <span>Recommended Phase Workflow</span>
            </h3>
            <ol className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 font-sans list-decimal list-inside leading-relaxed">
              <li>Copy the Master Prompt above into your {selectedTool} chat window.</li>
              <li>Let the agent scaffold the required files in your repository.</li>
              <li>Run <code className="text-purple-600 dark:text-purple-400 font-mono bg-purple-500/10 px-1 py-0.5 rounded">npm run dev</code> to verify runtime compilation.</li>
              <li>Click &ldquo;Mark Milestone Done&rdquo; above to advance your Torus streak.</li>
            </ol>
          </div>

          {/* Floating Robot Debugger Trigger */}
          <button
            onClick={() => setShowRobot(!showRobot)}
            className="fixed bottom-6 right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            title="Open Error Fixer Bot"
          >
            <Bot size={22} />
          </button>

          {/* Floating Robot Fixer Modal */}
          {showRobot && (
            <div className="fixed bottom-20 right-8 z-50 w-96 bg-white dark:bg-[#0e101a] border border-rose-500/30 rounded-2xl p-5 shadow-2xl animate-fade-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                  <Bot size={18} />
                  <span>Robot Debug Assistant</span>
                </div>
                <button onClick={() => setShowRobot(false)} className="text-xs text-neutral-400 hover:text-white">✕</button>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                Hit an error in {selectedTool}? Paste your stack trace below for an immediate recovery prompt.
              </p>
              <textarea
                value={errorLog}
                onChange={e => setErrorLog(e.target.value)}
                placeholder="Paste terminal log or exception trace..."
                rows={4}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 text-xs font-mono text-neutral-900 dark:text-white outline-none resize-none mb-3"
              />
              <button
                onClick={generateFixPrompt}
                disabled={!errorLog || fixing}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-40"
              >
                {fixing ? 'Generating Fix Prompt...' : 'Generate IDE Fix Prompt'}
              </button>
            </div>
          )}

        </main>

        {/* ── RIGHT PANE: PROJECT BRAIN & SCHEMA (col-span-3) ── */}
        <aside className="lg:col-span-3 bg-white/70 dark:bg-[#0c0d15]/60 border-l border-neutral-200/80 dark:border-white/10 p-4 overflow-y-auto space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-white/5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Project Topology
            </span>
            <Database size={13} className="text-emerald-500" />
          </div>

          {/* Database Entities */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-neutral-900 dark:text-white">
              <Database size={14} className="text-emerald-500" />
              <span>Data Collections</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {['users', 'projects', 'phases', 'features', 'telemetry'].map(table => (
                <div
                  key={table}
                  className="p-2 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 flex items-center justify-between"
                >
                  <span className="text-neutral-800 dark:text-neutral-200">{table}</span>
                  <span className="text-[10px] text-neutral-400">firestore</span>
                </div>
              ))}
            </div>
          </div>

          {/* Directory Tree Spec */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-neutral-900 dark:text-white">
              <Folder size={14} className="text-cyan-500" />
              <span>Architecture Structure</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 font-mono text-xs text-neutral-600 dark:text-neutral-400 space-y-1 leading-relaxed">
              <div>📁 app/</div>
              <div className="pl-3">📁 (app)/dashboard/</div>
              <div className="pl-3">📁 planner/</div>
              <div className="pl-3">📁 api/ai/</div>
              <div>📁 components/</div>
              <div className="pl-3">📄 Navbar.tsx</div>
              <div className="pl-3">📄 Sidebar.tsx</div>
              <div>📁 lib/</div>
              <div className="pl-3">📄 groq.ts</div>
              <div className="pl-3">📄 searxng.ts</div>
            </div>
          </div>

          {/* Tech Stack Specs */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-neutral-900 dark:text-white">
              <Layers size={14} className="text-purple-500" />
              <span>Stack Primitives</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Framework:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">Next.js 14 App Router</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Engine:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">Groq Llama 3.3 70B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Grounding:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">SearXNG Search</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Database:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">Firebase Firestore</span>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-neutral-400">Loading Workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  )
}
