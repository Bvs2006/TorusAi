'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Clock, ArrowRight, Layers } from 'lucide-react'

function getResumeStep(project: any) {
  if (project.current_step) return project.current_step

  const phases = project.phases || []
  if (!phases.length) return 'features'

  let lastCompletedPhase = -1
  for (let i = 0; i < phases.length; i++) {
    if (phases[i].status === 'done') lastCompletedPhase = i
  }

  if (lastCompletedPhase >= 0 && phases[lastCompletedPhase].name?.toLowerCase().includes('feature')) return 'architecture'
  if (lastCompletedPhase >= 1 && phases[lastCompletedPhase].name?.toLowerCase().includes('architecture')) return 'blueprint'
  if (lastCompletedPhase >= 2 && phases[lastCompletedPhase].name?.toLowerCase().includes('blueprint')) return 'deploy'

  return 'features'
}

function getProjectProgress(project: any) {
  const step = getResumeStep(project)
  switch (step) {
    case 'idea': return 10
    case 'features': return 25
    case 'architecture': return 50
    case 'prompts': return 65
    case 'blueprint': return 80
    case 'deploy': return 90
    case 'done': return 100
    default: return 20
  }
}

export default function ActiveProjectList({ projects }: { projects: any[] }) {
  const router = useRouter()
  const [items, setItems] = useState(projects)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const activeProjects = useMemo(() => items.filter((project: any) => project.status === 'active'), [items])

  async function handleDelete(projectId: string, projectName: string) {
    const confirmed = window.confirm(`Delete ${projectName || 'this project'}? This will remove the project, phases, and features.`)
    if (!confirmed) return

    try {
      setDeletingId(projectId)
      const response = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to delete project')
      }

      setItems(prev => prev.filter(project => project.id !== projectId))
      router.refresh()
    } catch (error: any) {
      console.error('Delete project failed:', error)
      window.alert(error.message || 'Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  if (!activeProjects.length) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center mx-auto mb-3 text-neutral-400">
          <Layers size={20} />
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">No active projects found. Time to architect something new!</p>
        <Link
          href="/planner"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mt-3 hover:underline"
        >
          Start a project plan →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activeProjects.map((proj: any) => {
        const resumeStep = getResumeStep(proj)
        const stepPath = `/planner/${resumeStep}?project=${proj.id}`
        const isDeleting = deletingId === proj.id
        const progress = getProjectProgress(proj)

        return (
          <div
            key={proj.id}
            className="group relative p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 hover:border-purple-500/40 transition-all flex items-center justify-between gap-4"
          >
            <Link href={stepPath} className="flex-1 min-w-0 block">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate">
                  {proj.name || 'Untitled Architecture'}
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-white/5 text-neutral-600 dark:text-neutral-400">
                  {resumeStep}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {proj.idea || 'No description provided.'}
              </p>
            </Link>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20">
                {progress}%
              </div>

              <button
                type="button"
                onClick={() => handleDelete(proj.id, proj.name)}
                disabled={isDeleting}
                className="w-8 h-8 rounded-lg border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 flex items-center justify-center transition-colors disabled:opacity-40"
                aria-label={`Delete ${proj.name || 'project'}`}
                title="Delete project"
              >
                {isDeleting ? <Clock size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
