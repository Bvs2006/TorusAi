import StepDetails from '@/components/StepDetails'

export default function StepPage({ params, searchParams }: { params: { id: string }, searchParams?: { project?: string } }) {
  const projectId = searchParams?.project
  const id = params.id // expected to be phase number string

  return (
    <div style={{ padding: 28, maxWidth: 1000, margin: '0 auto' }}>
      <StepDetails phaseId={Number(id)} projectId={projectId || undefined} />
    </div>
  )
}
