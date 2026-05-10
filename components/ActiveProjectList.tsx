'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Clock } from 'lucide-react'

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
    case 'idea': return 10;
    case 'features': return 20;
    case 'architecture': return 40;
    case 'prompts': return 60;
    case 'blueprint': return 80;
    case 'deploy': return 90;
    case 'done': return 100;
    default: return 20;
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
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ color: '#607276', fontSize: '14px' }}>No active projects. Time to build!</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {activeProjects.map((proj: any) => {
        const resumeStep = getResumeStep(proj)
        const stepPath = `/planner/${resumeStep}?project=${proj.id}`
        const isDeleting = deletingId === proj.id

        return (
          <div
            key={proj.id}
            className="active-project-card"
            style={{
              padding: '14px 16px',
              background: 'rgba(66,127,131,.08)',
              border: '1px solid rgba(66,127,131,.2)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            <Link href={stepPath} style={{ textDecoration: 'none', flex: 1, display: 'block', paddingRight: '10px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326' }}>{proj.name || 'Untitled Project'}</div>
                <div style={{ fontSize: '11px', color: '#8a9a9d', marginTop: '3px' }}>{proj.idea?.substring(0, 50) || 'No description'}...</div>
              </div>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', color: '#5aa0a4', fontWeight: 600, padding: '4px 10px', background: 'rgba(90,160,164,.1)', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                {getProjectProgress(proj)}%
              </div>
              <button
                type="button"
                onClick={() => handleDelete(proj.id, proj.name)}
                disabled={isDeleting}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: '1px solid rgba(244,63,94,.25)',
                  background: isDeleting ? 'rgba(244,63,94,.08)' : 'rgba(244,63,94,.12)',
                  color: '#f43f5e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
                aria-label={`Delete ${proj.name || 'project'}`}
                title="Delete project"
              >
                {isDeleting ? <Clock size={14} /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
