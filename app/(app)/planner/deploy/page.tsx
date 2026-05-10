'use client'
// app/(app)/planner/deploy/page.tsx — Step 6: Deploy Guide
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { StepIndicator, showToast } from '@/components/ui'
import { Check, Copy, ChevronDown, ChevronUp, ExternalLink, ArrowRight } from 'lucide-react'
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
      <div style={{ padding: '28px 32px', maxWidth: '760px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '18px', height: '18px', border: '2px solid var(--border-subtle)', borderTopColor: 'var(--accent-teal)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading deployment guide...
        </div>
      </div>
    )
  }

  const recommendedPlatform = project?.stack?.deployment?.name || 'Vercel'
  const recommendedReason = project?.stack?.deployment?.reason || 'Zero-config Next.js, free tier'
  
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
      n: 2, title: 'Set up Database', emoji: '🔵',
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
    <div style={{ padding: '28px 32px', maxWidth: '760px', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}>
      <StepIndicator steps={STEPS} current={5} />
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
          🚀 Deployment Guide
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
          {done.size}/{dynamicDeploySteps.length} steps complete · Follow these steps to go live with your project.
        </p>
        <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(done.size / dynamicDeploySteps.length) * 100}%`, background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))', borderRadius: '3px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
      </div>

      {/* Recommended Platform Card */}
      <div style={{ 
        background: 'var(--surface-glass)', 
        backdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--border-subtle)', 
        borderRadius: '20px', 
        padding: '24px', 
        marginBottom: '32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px', fontFamily: 'DM Mono, monospace' }}>Recommended Platform</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px', fontFamily: 'Syne, sans-serif' }}>{recommendedPlatform}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{recommendedReason}</div>
        </div>
        <a 
          href={platformUrl}
          target="_blank" 
          rel="noreferrer"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
            background: 'var(--text-heading)', color: 'var(--bg)', textDecoration: 'none', 
            borderRadius: '12px', fontSize: '14px', fontWeight: 700, transition: 'all 0.2s',
            fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Open {recommendedPlatform} <ExternalLink size={16} />
        </a>
      </div>

      {dynamicDeploySteps.map(step => {
        const isExpanded = expanded === step.n
        const isDone = done.has(step.n)
        return (
          <div key={step.n} style={{ 
            marginBottom: '16px', 
            background: isExpanded ? 'var(--surface-overlay)' : 'var(--surface-glass)', 
            backdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border-subtle)', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            transition: 'all 0.3s ease',
            boxShadow: isExpanded ? 'var(--hover-shadow)' : 'none'
          }}>
            {/* Header */}
            <button onClick={() => setExpanded(isExpanded ? 0 : step.n)} style={{
              width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left'
            }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', 
                background: isDone ? 'var(--success)' : isExpanded ? 'var(--focus)' : 'var(--bg-3)', 
                border: `1px solid ${isDone ? 'var(--success)' : isExpanded ? 'var(--primary)' : 'var(--border-subtle)'}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: isDone ? '16px' : '12px', flexShrink: 0, 
                color: isDone ? '#fff' : isExpanded ? 'var(--primary)' : 'var(--text-subtle)', 
                fontFamily: 'DM Mono, monospace', fontWeight: 700,
                transition: 'all 0.2s'
              }}>
                {isDone ? '✓' : step.n}
              </div>
              <span style={{ fontSize: '24px' }}>{step.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: isDone ? 'var(--success)' : 'var(--text-heading)' }}>
                  Step {step.n}: {step.title}
                </div>
              </div>
              {isExpanded ? <ChevronUp size={20} color="var(--text-subtle)" /> : <ChevronDown size={20} color="var(--text-subtle)" />}
            </button>

            {/* Content */}
            {isExpanded && (
              <div style={{ padding: '0 20px 24px', animation: 'fadeUp .3s ease' }}>
                {step.notes && (
                  <div style={{ background: 'var(--focus)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    <span style={{ marginRight: '8px' }}>💡</span> {step.notes}
                  </div>
                )}

                {step.commands && (
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => copyCmd(step.commands!.join('\n'), String(step.n))} style={{
                      position: 'absolute', top: '12px', right: '12px',
                      padding: '6px 12px', background: 'var(--bg-3)', border: '1px solid var(--border-subtle)',
                      borderRadius: '8px', color: 'var(--text-heading)', fontSize: '11px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Mono, monospace', zIndex: 1,
                      transition: 'all 0.2s'
                    }}>
                      {copied === String(step.n) ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                      {copied === String(step.n) ? 'Copied' : 'Copy'}
                    </button>
                    <pre style={{ 
                      background: 'var(--surface-overlay)', 
                      borderRadius: '12px', 
                      padding: '20px', 
                      fontSize: '13px', 
                      color: 'var(--text)', 
                      fontFamily: 'var(--font-mono), monospace', 
                      lineHeight: '1.8', 
                      overflowX: 'auto', 
                      margin: 0,
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {step.commands.map((cmd, i) => (
                        <div key={i} style={{ color: cmd.startsWith('#') ? 'var(--text-subtle)' : 'var(--text)' }}>
                          {cmd.startsWith('#') ? '' : <span style={{ color: 'var(--accent-teal)', opacity: 0.7, marginRight: '8px' }}>$</span>}{cmd}
                        </div>
                      ))}
                    </pre>
                  </div>
                )}

                {step.checklist && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {step.checklist.map(item => (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '4px 0' }}>
                        <div onClick={() => setChecklist(prev => { const n = new Set(prev); n.has(item) ? n.delete(item) : n.add(item); return n })}
                          style={{ 
                            width: '20px', height: '20px', borderRadius: '6px', 
                            border: `2px solid ${checklist.has(item) ? 'var(--success)' : 'var(--border-subtle)'}`, 
                            background: checklist.has(item) ? 'var(--success)' : 'transparent', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            flexShrink: 0, cursor: 'pointer', transition: 'all .2s' 
                          }}>
                          {checklist.has(item) && <Check size={14} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '14px', color: checklist.has(item) ? 'var(--success)' : 'var(--text-muted)', textDecoration: checklist.has(item) ? 'line-through' : 'none', transition: 'all 0.2s' }}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button onClick={() => toggleDone(step.n)} style={{
                    padding: '10px 24px', 
                    background: isDone ? 'rgba(16,185,129,0.1)' : 'var(--accent-teal)',
                    border: `1px solid ${isDone ? 'var(--success)' : 'transparent'}`,
                    borderRadius: '10px', color: isDone ? 'var(--success)' : '#fff',
                    fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                  }}>
                    {isDone ? <><Check size={16} /> Done</> : '✓ Mark Complete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Completion Card */}
      {done.size >= dynamicDeploySteps.length - 1 && allChecked && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(16,185,129,.1), rgba(8,145,178,.08))', 
          border: '1px solid var(--success)', 
          borderRadius: '24px', 
          padding: '40px 24px', 
          textAlign: 'center', 
          marginTop: '16px', 
          marginBottom: '32px',
          boxShadow: '0 20px 40px rgba(16,185,129,0.1)',
          animation: 'fadeUp 0.5s ease'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--success)', marginBottom: '8px' }}>Your project is live!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>Congratulations! You've successfully deployed your app. Share the URL and keep building.</p>
        </div>
      )}

      {/* Footer Navigation */}
      <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px',
          background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', color: '#fff', textDecoration: 'none',
          borderRadius: '14px', fontSize: '15px', fontWeight: 800, fontFamily: 'Syne, sans-serif',
          boxShadow: '0 8px 24px rgba(66,127,131,0.3)', transition: 'all 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Finish & Go to Dashboard <ArrowRight size={18} />
        </Link>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
