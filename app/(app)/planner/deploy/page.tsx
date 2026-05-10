'use client'
// app/(app)/planner/deploy/page.tsx — Step 6: Deploy Guide
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { StepIndicator, showToast } from '@/components/ui'
import { Check, Copy, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/utils/firebase/client'

const STEPS = ['Idea', 'Features', 'Architecture', 'Prompts', 'Blueprint', 'Deploy']

export default function DeployPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number>(1)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [checklist, setChecklist] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }
    
    getDoc(doc(db as any, 'projects', projectId)).then((snap) => {
      if (snap.exists()) {
        setProject({ id: snap.id, ...snap.data() as any })
      }
      setLoading(false)
    })
  }, [projectId])

  async function copyCmd(cmd: string, key: string) {
    const clean = cmd.replace(/^#.*\n?/gm, '').trim()
    if (!clean) return
    await navigator.clipboard.writeText(clean)
    setCopied(key); showToast('✓ Commands copied!')
    setTimeout(() => setCopied(null), 2500)
  }

  function toggleDone(n: number) {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n); else next.add(n)
      return next
    })
    if (!done.has(n)) {
      setTimeout(() => setExpanded(n + 1), 300)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '28px 32px', maxWidth: '760px', color: '#607276' }}>
        Loading deployment guide...
      </div>
    )
  }

  // Determine the recommended deployment platform from the project stack
  const recommendedPlatform = project?.stack?.deployment?.name || 'Vercel'
  const recommendedReason = project?.stack?.deployment?.reason || 'Zero-config Next.js, free tier'
  
  // Create direct link based on platform
  let platformUrl = 'https://vercel.com/new'
  const lowerPlatform = recommendedPlatform.toLowerCase()
  if (lowerPlatform.includes('railway')) platformUrl = 'https://railway.app/new'
  if (lowerPlatform.includes('netlify')) platformUrl = 'https://app.netlify.com/start'
  if (lowerPlatform.includes('render')) platformUrl = 'https://dashboard.render.com/select-repo?type=web'
  if (lowerPlatform.includes('aws')) platformUrl = 'https://aws.amazon.com/amplify/'
  if (lowerPlatform.includes('firebase')) platformUrl = 'https://console.firebase.google.com/'

  const dynamicDeploySteps = [
    {
      n: 1, title: 'Push to GitHub', emoji: '🐙',
      commands: ['git init', 'git add .', 'git commit -m "Initial commit"', 'git branch -M main', 'git remote add origin https://github.com/youruser/your-project.git', 'git push -u origin main'],
      notes: 'Create a new repo on github.com first, then run these commands in your project folder.'
    },
    {
      n: 2, title: 'Set up Supabase / Database', emoji: '🔵',
      commands: ['# Go to your database dashboard', '# Create new project', '# Copy connection URL/keys', '# Run migrations if necessary'],
      notes: 'Ensure your database is accessible and you have the production credentials ready.'
    },
    {
      n: 3, title: `Deploy to ${recommendedPlatform}`, emoji: '🚀',
      commands: lowerPlatform.includes('vercel') 
        ? ['npm install -g vercel', 'vercel', '# Or: connect GitHub repo at vercel.com', '# Auto-deploys on every git push']
        : lowerPlatform.includes('railway')
        ? ['npm i -g @railway/cli', 'railway login', 'railway link', 'railway up']
        : ['# Connect your GitHub repository directly on the platform dashboard', '# Select the main branch', '# Click Deploy'],
      notes: `${recommendedPlatform} will automatically detect your framework and install dependencies.`
    },
    {
      n: 4, title: 'Set Environment Variables', emoji: '🔑',
      commands: ['# In your Deployment Dashboard → Settings → Environment Variables', 'DATABASE_URL=...', 'NEXT_PUBLIC_API_URL=...', 'GROQ_API_KEY=...'],
      notes: 'Never put keys in your code. Always use environment variables. Redeploy after adding env vars.'
    },
    {
      n: 5, title: 'Verify & Go Live', emoji: '✨',
      checklist: [
        'Visit your deployed URL — app loads without errors',
        'Authentication works',
        'Database reads/writes succeed',
        'API routes and AI features are responsive',
      ],
      notes: 'Your app is live! Share the URL and start building.'
    },
  ]

  const allDone = dynamicDeploySteps.filter(s => !s.checklist).every(s => done.has(s.n))
  const checklistItems = dynamicDeploySteps.find(s => s.checklist)?.checklist || []
  const allChecked = checklistItems.every(item => checklist.has(item))

  return (
    <div style={{ padding: '28px 32px', maxWidth: '760px' }}>
      <StepIndicator steps={STEPS} current={5} />
      
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>
          🚀 Deployment Guide
        </h1>
        <p style={{ color: '#607276', fontSize: '13px' }}>
          {done.size}/{dynamicDeploySteps.length} steps complete · Follow these steps to go live
        </p>
        <div style={{ height: '4px', background: 'rgba(43,69,72,.12)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(done.size / dynamicDeploySteps.length) * 100}%`, background: 'linear-gradient(90deg, #427f83, #10b981)', borderRadius: '2px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Recommended Platform Card */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Recommended Platform</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{recommendedPlatform}</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>{recommendedReason}</div>
        </div>
        <a 
          href={platformUrl}
          target="_blank" 
          rel="noreferrer"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
            background: '#0f172a', color: '#fff', textDecoration: 'none', 
            borderRadius: '8px', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' 
          }}
        >
          Open {recommendedPlatform} <ExternalLink size={16} />
        </a>
      </div>

      {dynamicDeploySteps.map(step => {
        const isExpanded = expanded === step.n
        const isDone = done.has(step.n)
        return (
          <div key={step.n} style={{ marginBottom: '10px', background: 'rgba(255,255,255,.62)', border: `1px solid ${isDone ? 'rgba(16,185,129,.3)' : isExpanded ? 'rgba(66,127,131,.3)' : 'rgba(38,69,72,.12)'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
            {/* Header */}
            <button onClick={() => setExpanded(isExpanded ? 0 : step.n)} style={{
              width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left'
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isDone ? '#10b981' : isExpanded ? 'rgba(66,127,131,.2)' : 'rgba(43,69,72,.12)', border: `1px solid ${isDone ? '#10b981' : isExpanded ? '#427f83' : 'rgba(38,69,72,.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDone ? '14px' : '11px', flexShrink: 0, color: isDone ? '#fff' : isExpanded ? '#83b9bd' : '#607276', fontFamily: 'DM Mono, monospace' }}>
                {isDone ? '✓' : step.n}
              </div>
              <span style={{ fontSize: '20px' }}>{step.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, color: isDone ? '#10b981' : '#172326' }}>
                  Step {step.n}: {step.title}
                </div>
              </div>
              {isExpanded ? <ChevronUp size={16} color="#8a9a9d" /> : <ChevronDown size={16} color="#8a9a9d" />}
            </button>

            {/* Content */}
            {isExpanded && (
              <div style={{ padding: '0 16px 16px', animation: 'fadeUp .2s ease' }}>
                {step.notes && (
                  <div style={{ background: 'rgba(124,58,237,.08)', border: '1px solid rgba(66,127,131,.15)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '12px', color: '#607276' }}>
                    💡 {step.notes}
                  </div>
                )}

                {step.commands && (
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => copyCmd(step.commands!.join('\n'), String(step.n))} style={{
                      position: 'absolute', top: '10px', right: '10px',
                      padding: '4px 10px', background: 'rgba(66,127,131,.2)', border: '1px solid rgba(66,127,131,.3)',
                      borderRadius: '6px', color: '#83b9bd', fontSize: '10px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace', zIndex: 1
                    }}>
                      {copied === String(step.n) ? <Check size={10} /> : <Copy size={10} />}
                      {copied === String(step.n) ? 'Copied' : 'Copy'}
                    </button>
                    <pre style={{ background: 'rgba(255,255,255,.54)', borderRadius: '10px', padding: '14px 14px 14px 14px', fontSize: '12px', color: '#83b9bd', fontFamily: 'DM Mono, monospace', lineHeight: '1.8', overflowX: 'auto', margin: 0 }}>
                      {step.commands.map((cmd, i) => (
                        <div key={i} style={{ color: cmd.startsWith('#') ? '#8a9a9d' : '#83b9bd' }}>
                          {cmd.startsWith('#') ? '' : '$ '}{cmd}
                        </div>
                      ))}
                    </pre>
                  </div>
                )}

                {step.checklist && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {step.checklist.map(item => (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <div onClick={() => setChecklist(prev => { const n = new Set(prev); n.has(item) ? n.delete(item) : n.add(item); return n })}
                          style={{ width: '18px', height: '18px', borderRadius: '4px', border: `1.5px solid ${checklist.has(item) ? '#10b981' : 'rgba(255,255,255,.15)'}`, background: checklist.has(item) ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all .15s' }}>
                          {checklist.has(item) && <Check size={11} color="#fff" />}
                        </div>
                        <span style={{ fontSize: '13px', color: checklist.has(item) ? '#10b981' : '#607276', textDecoration: checklist.has(item) ? 'line-through' : 'none' }}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={() => toggleDone(step.n)} style={{
                    padding: '8px 18px', background: isDone ? 'rgba(16,185,129,.15)' : '#427f83',
                    border: `1px solid ${isDone ? 'rgba(16,185,129,.3)' : 'transparent'}`,
                    borderRadius: '8px', color: isDone ? '#10b981' : '#fff',
                    fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    {isDone ? <><Check size={13} /> Done</> : '✓ Mark Complete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Completion */}
      {done.size >= dynamicDeploySteps.length - 1 && allChecked && (
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.1), rgba(124,58,237,.08))', border: '1px solid rgba(16,185,129,.3)', borderRadius: '16px', padding: '28px', textAlign: 'center', marginTop: '10px', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>Your project is live!</h2>
          <p style={{ color: '#607276', fontSize: '13px', margin: 0 }}>Share your URL and keep building. You earned the 🚀 First Ship badge!</p>
        </div>
      )}

      {/* Always Visible Next Step */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(43,69,72,.12)', paddingTop: '24px' }}>
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'linear-gradient(135deg, #365f62, #83b9bd)', color: '#fff', textDecoration: 'none',
          borderRadius: '10px', fontSize: '14px', fontWeight: 800, fontFamily: 'Syne, sans-serif',
          boxShadow: '0 4px 20px rgba(66,127,131,.3)', transition: 'transform 0.2s'
        }}>
          Finish & Go to Dashboard →
        </Link>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}
