'use client'
import { useState } from 'react'
import { Sparkles, Users, Layers, ArrowRight, Zap } from 'lucide-react'
import { useTeam } from '@/app/(app)/team/TeamContext'
import { useRouter } from 'next/navigation'

export default function TeamIdeaAnalyzer() {
  const router = useRouter()
  const { refreshProjects, setActiveProjectById } = useTeam()
  const [idea, setIdea] = useState('')
  const [platform, setPlatform] = useState('web')
  const [budget, setBudget] = useState('free')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [roleGuides, setRoleGuides] = useState<Record<string, any>>({})
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/team/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, platform, budget })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      await refreshProjects()
      setActiveProjectById(data.projectId)
      router.push('/team/workflow')
      
    } catch (err) {
      console.error(err)
      alert('Failed to analyze project')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateGuide(roleTitle: string) {
    if (!result) return
    setLoadingRole(roleTitle)
    try {
      const res = await fetch('/api/team/role-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, stack: result.suggested_stack, role: roleTitle })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setRoleGuides(prev => ({ ...prev, [roleTitle]: data }))
    } catch (err) {
      console.error(err)
      alert('Failed to generate role guide')
    } finally {
      setLoadingRole(null)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      
      {/* Input Section */}
      <div style={{ flex: 1, background: '#111214', border: '1px solid #1e1f23', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#3b82f6" /> Project Idea Analyzer
        </h2>
        <p style={{ color: '#a0a5ab', fontSize: '13px', marginBottom: '32px' }}>
          Convert your raw idea into a structured development plan and generate the perfect team roles.
        </p>

        <form onSubmit={handleAnalyze}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#e5e7eb', fontWeight: 600, marginBottom: '8px' }}>Project Idea</label>
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="e.g. A SaaS platform for AI interview prep with RAG and Stripe billing..."
              style={{
                width: '100%', minHeight: '160px', background: '#09090b', border: '1px solid #2a2c32',
                borderRadius: '12px', padding: '16px', color: '#e5e7eb', fontSize: '14px', outline: 'none', resize: 'vertical'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#e5e7eb', fontWeight: 600, marginBottom: '8px' }}>Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} style={{
                width: '100%', background: '#09090b', border: '1px solid #2a2c32',
                borderRadius: '10px', padding: '12px', color: '#e5e7eb', fontSize: '13px', outline: 'none'
              }}>
                <option value="web">Web App</option>
                <option value="mobile">Mobile App</option>
                <option value="desktop">Desktop App</option>
                <option value="api">Backend API</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: '#3b82f6',
            border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
          }}>
            {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%' }} /> : <Zap size={16} />}
            {loading ? 'Analyzing...' : 'Analyze Project & Generate Roles'}
          </button>
        </form>
      </div>



      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
