'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { getTeamProjects, getWorkflowNodes } from '@/utils/firebase/teamQueries'

interface TeamContextType {
  projects: any[]
  activeProject: any | null
  setActiveProjectById: (id: string) => void
  activeRole: string
  setActiveRole: (role: string) => void
  activeNode: string
  setActiveNode: (node: string) => void
  nodeDataCache: Record<string, any>
  refreshProjects: () => void
  refreshNodes: () => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<any[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [activeRole, setActiveRole] = useState('')
  const [activeNode, setActiveNode] = useState('')
  const [nodeDataCache, setNodeDataCache] = useState<Record<string, any>>({})

  const activeProject = projects.find(p => p.id === activeProjectId) || null

  async function loadProjects() {
    const data = await getTeamProjects()
    setProjects(data)
    if (data.length > 0 && !activeProjectId) {
      setActiveProjectId(data[0].id)
    }
  }

  async function loadNodes() {
    if (!activeProjectId) return
    const nodes = await getWorkflowNodes(activeProjectId)
    setNodeDataCache(nodes)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (activeProject) {
      if (activeProject.required_roles?.length > 0) setActiveRole(activeProject.required_roles[0].title)
      if (activeProject.custom_workflow_stages?.length > 0) setActiveNode(activeProject.custom_workflow_stages[0].id)
      loadNodes()
    }
  }, [activeProjectId, activeProject?.id])

  return (
    <TeamContext.Provider value={{
      projects, activeProject, setActiveProjectById: setActiveProjectId,
      activeRole, setActiveRole,
      activeNode, setActiveNode,
      nodeDataCache, refreshProjects: loadProjects, refreshNodes: loadNodes
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (!context) throw new Error('useTeam must be used within TeamProvider')
  return context
}
