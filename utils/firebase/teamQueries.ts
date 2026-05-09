import { collection, doc, setDoc, getDocs, getDoc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from './client'

export const TEAM_PROJECTS_COLLECTION = 'team_projects'
export const TEAM_WORKFLOWS_COLLECTION = 'team_workflows'

export async function saveTeamProject(project: any) {
  const projectId = project.id || Date.now().toString()
  const docRef = doc(db, TEAM_PROJECTS_COLLECTION, projectId)
  
  await setDoc(docRef, {
    ...project,
    id: projectId,
    created_at: serverTimestamp(),
  })
  return projectId
}

export async function getTeamProjects() {
  const q = query(collection(db, TEAM_PROJECTS_COLLECTION), orderBy('created_at', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function saveWorkflowNode(projectId: string, nodeId: string, nodeData: any) {
  const docRef = doc(db, TEAM_PROJECTS_COLLECTION, projectId, TEAM_WORKFLOWS_COLLECTION, nodeId)
  await setDoc(docRef, {
    ...nodeData,
    id: nodeId,
    updated_at: serverTimestamp()
  }, { merge: true })
}

export async function getWorkflowNodes(projectId: string) {
  const snapshot = await getDocs(collection(db, TEAM_PROJECTS_COLLECTION, projectId, TEAM_WORKFLOWS_COLLECTION))
  const nodes: Record<string, any> = {}
  snapshot.docs.forEach(doc => {
    nodes[doc.id] = doc.data()
  })
  return nodes
}

export async function updateProjectStatus(projectId: string, updates: any) {
  const docRef = doc(db, TEAM_PROJECTS_COLLECTION, projectId)
  await updateDoc(docRef, updates)
}
