import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/utils/firebase/admin'
import { cookies } from 'next/headers'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    if (!projectId) {
      return NextResponse.json({ error: 'Missing project id' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const session = cookieStore.get('fb_session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await adminAuth.verifySessionCookie(session, true)
    const userId = decoded.uid

    const projectRef = adminDb.collection('projects').doc(projectId)
    const projectSnap = await projectRef.get()

    if (!projectSnap.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const projectData = projectSnap.data()
    if (projectData?.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [featuresSnap, phasesSnap] = await Promise.all([
      adminDb.collection('features').where('project_id', '==', projectId).get(),
      adminDb.collection('phases').where('project_id', '==', projectId).get(),
    ])

    const batch = adminDb.batch()

    featuresSnap.docs.forEach(docSnap => batch.delete(docSnap.ref))
    phasesSnap.docs.forEach(docSnap => batch.delete(docSnap.ref))
    batch.delete(projectRef)

    await batch.commit()

    return NextResponse.json({ success: true, deletedProjectId: projectId })
  } catch (error: any) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: 500 })
  }
}
