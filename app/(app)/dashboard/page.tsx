// app/(app)/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { Plus, Zap, ArrowRight, Clock, Flame, Sparkles, Terminal, Compass, Layers } from 'lucide-react'
import StreakWidget from '@/components/StreakWidget'
import ActiveProjectList from '@/components/ActiveProjectList'

const QUICK_TOOLS = [
  { href: '/error-fix', icon: <Terminal size={18} className="text-purple-500 dark:text-purple-400" />, label: 'Error Fix Assistant', desc: 'Debug stack traces and generate fix prompts' },
  { href: '/master-prompt', icon: <Sparkles size={18} className="text-cyan-500 dark:text-cyan-400" />, label: 'Master Prompt', desc: 'Convert rough ideas into comprehensive prompts' },
  { href: '/tools', icon: <Compass size={18} className="text-emerald-500 dark:text-emerald-400" />, label: 'AI Tool Directory', desc: 'Browse 30+ benchmarked AI developer tools' },
  { href: '/mcp', icon: <Layers size={18} className="text-amber-500 dark:text-amber-400" />, label: 'Torus MCP Server', desc: 'Trigger planning directly from Cursor & VS Code' }
]

export default async function DashboardPage({ searchParams }: { searchParams: { tab?: string } }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (!session) redirect('/login')

  let uid = ''
  try {
    const decoded = await adminAuth.verifySessionCookie(session!, true)
    uid = decoded.uid
  } catch { redirect('/login') as never }
  if (!uid) redirect('/login')

  const tab = searchParams.tab

  const profileSnap = await adminDb.collection('profiles').doc(uid!).get()
  const profile = profileSnap.exists ? profileSnap.data() : {}
  let projects: any[] = []

  // Fetch projects
  const projectsSnap = await adminDb.collection('projects')
    .where('user_id', '==', uid!)
    .limit(tab === 'recent' ? 50 : 10)
    .get()
  projects = projectsSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  // Fetch phases for all projects
  const projectsWithPhases = await Promise.all(
    projects.map(async (proj: any) => {
      const phasesSnap = await adminDb.collection('phases')
        .where('project_id', '==', proj.id)
        .get()
      const phases = phasesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { ...proj, phases }
    })
  )
  projects = projectsWithPhases

  const username = profile?.username || 'Builder'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const totalProjects = projects?.length || 0
  const completedProjects = projects?.filter((p: any) => p.status === 'completed').length || 0
  const activeProjects = projects?.filter((p: any) => p.status === 'active').length || 0
  const totalPhasesDone = projects.reduce((acc, p) => acc + (p.phases?.filter((ph: any) => ph.status === 'done').length || 0), 0)

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto text-neutral-900 dark:text-white/90 font-sans selection:bg-purple-500/30 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. WELCOME HEADER
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>Workspace Active</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal text-neutral-900 dark:text-white tracking-tight">
            {greeting}, <span className="italic font-light text-neutral-900 dark:text-white/90">{username}</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base mt-2">
            Track your ongoing builds, monitor architecture phases, and generate IDE prompts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:scale-[1.02]"
          >
            <Plus size={15} /> New Project Plan
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRICS ROW (PASTEL TINTED CARDS)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        
        {/* Total Projects (Ice Blue Tint) */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#131b26] border border-neutral-200/90 dark:border-[#1e2e42] shadow-sm dark:shadow-none relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
            Total Projects
          </span>
          <div className="text-4xl font-bold text-blue-600 dark:text-[#7ca9f4] tracking-tight">
            {totalProjects}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
            {completedProjects} completed · {activeProjects} active
          </p>
        </div>

        {/* Phases Done (Sage Green Tint) */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#13241b] border border-neutral-200/90 dark:border-[#1e3b2c] shadow-sm dark:shadow-none relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
            Phases Completed
          </span>
          <div className="text-4xl font-bold text-emerald-600 dark:text-[#6ee7b7] tracking-tight">
            {totalPhasesDone}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
            Across all project roadmaps
          </p>
        </div>

        {/* Torus Streak (Orchid Purple Tint) */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#241728] border border-neutral-200/90 dark:border-[#3d2344] shadow-sm dark:shadow-none relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
            Streak Status
          </span>
          <div className="text-4xl font-bold text-purple-600 dark:text-[#e879f9] tracking-tight flex items-center gap-2">
            <Flame size={32} className="text-amber-500 fill-amber-500" /> Active
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
            Daily architecture progress
          </p>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. STREAK WIDGET ROW
          ───────────────────────────────────────────────────────────── */}
      <div className="mb-10 bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} className="text-amber-500 fill-amber-500" />
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Daily Torus Streak</h2>
        </div>
        <StreakWidget userId={uid} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN GRID: ACTIVE PROJECTS + QUICK TOOLS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Projects (Left Column) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-purple-500 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Active Projects</h2>
            </div>
            <Link
              href="/dashboard?tab=recent"
              className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              View all ({projects.length}) →
            </Link>
          </div>

          <ActiveProjectList projects={projects} />
        </div>

        {/* Quick Tools & Shortcuts (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-white/[0.06]">
              <Zap size={16} className="text-cyan-500 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Developer Shortcuts</h3>
            </div>

            <div className="space-y-2.5">
              {QUICK_TOOLS.map(tool => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-neutral-200/70 dark:border-white/5 hover:border-purple-500/30 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate">
                      {tool.label}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {tool.desc}
                    </p>
                  </div>
                  <ArrowRight size={13} className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
