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

type DeploymentRecommendation = {
  platform: string
  url: string
  reason: string
  bestFor: string[]
  watchOut: string
  commands: string[]
  alternatives: { name: string; reason: string }[]
}

const platformLinks: Record<string, string> = {
  vercel: 'https://vercel.com/new',
  netlify: 'https://app.netlify.com/start',
  railway: 'https://railway.app/new',
  render: 'https://dashboard.render.com/select-repo?type=web',
  firebase: 'https://console.firebase.google.com/',
  cloudflare: 'https://dash.cloudflare.com/'
}

const platformCommands: Record<string, string[]> = {
  vercel: ['npm install -g vercel', 'vercel', '# Or connect GitHub repo at vercel.com', '# Auto-deploys on every git push'],
  netlify: ['npm install -g netlify-cli', 'netlify login', 'netlify init', 'netlify deploy --prod'],
  railway: ['npm i -g @railway/cli', 'railway login', 'railway link', 'railway up'],
  render: ['# Open Render dashboard', '# New Web Service -> Connect GitHub repo', '# Build command: npm run build', '# Start command: npm start'],
  firebase: ['npm install -g firebase-tools', 'firebase login', 'firebase init hosting', 'npm run build', 'firebase deploy'],
  cloudflare: ['npm create cloudflare@latest', 'npm run build', 'npx wrangler pages deploy .vercel/output/static']
}

function getStackName(project: any, key: string) {
  const value = project?.stack?.[key]
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.name || value.aiRecommended || ''
}

function hasText(source: string, words: string[]) {
  return words.some(word => source.includes(word))
}

function getDeploymentRecommendation(project: any): DeploymentRecommendation {
  const stack = {
    frontend: getStackName(project, 'frontend'),
    backend: getStackName(project, 'backend'),
    database: getStackName(project, 'database'),
    auth: getStackName(project, 'auth'),
    ai: getStackName(project, 'ai'),
    deployment: getStackName(project, 'deployment')
  }
  const source = JSON.stringify({ stack, features: project?.features, name: project?.name, idea: project?.idea }).toLowerCase()
  const savedPlatform = stack.deployment || 'Vercel'

  const isNext = hasText(source, ['next.js', 'nextjs', 'next js'])
  const isStatic = hasText(source, ['static site', 'landing page', 'portfolio']) && !hasText(source, ['api route', 'backend', 'database'])
  const usesFirebase = hasText(source, ['firebase', 'firestore'])
  const usesEdge = hasText(source, ['edge', 'worker', 'cloudflare'])
  const hasBackend = hasText(source, ['express', 'node.js', 'nodejs', 'fastapi', 'django', 'api route', 'backend', 'server'])
  const hasDatabase = hasText(source, ['postgres', 'postgresql', 'mysql', 'mongodb', 'redis', 'database', 'supabase'])
  const hasLongRunningWork = hasText(source, ['websocket', 'queue', 'cron', 'background job', 'docker', 'worker'])

  if (usesFirebase && !hasLongRunningWork && !hasBackend) {
    return {
      platform: 'Firebase Hosting',
      url: platformLinks.firebase,
      reason: 'Best fit because the project already uses Firebase/Firestore and can keep auth, database, hosting, and env setup in one console.',
      bestFor: ['Firebase auth projects', 'Firestore apps', 'student demos with simple hosting'],
      watchOut: 'Use Vercel or Render instead if your app needs custom server routes, long-running workers, or Docker.',
      commands: platformCommands.firebase,
      alternatives: [
        { name: 'Vercel', reason: 'Better if the app is a Next.js app with API routes.' },
        { name: 'Netlify', reason: 'Good for static React sites and simple serverless functions.' }
      ]
    }
  }

  if (usesEdge) {
    return {
      platform: 'Cloudflare Pages',
      url: platformLinks.cloudflare,
      reason: 'Best fit when the app needs global edge performance, lightweight APIs, or Worker-style deployment.',
      bestFor: ['Edge APIs', 'high-speed global apps', 'static frontend plus Workers'],
      watchOut: 'Some Node.js packages do not work on the edge runtime, so verify dependencies before moving fully to Workers.',
      commands: platformCommands.cloudflare,
      alternatives: [
        { name: 'Vercel', reason: 'Simpler for standard Next.js deployments.' },
        { name: 'Render', reason: 'Better for traditional Node servers or Docker apps.' }
      ]
    }
  }

  if ((hasBackend && hasDatabase && !isNext) || hasLongRunningWork) {
    return {
      platform: hasLongRunningWork ? 'Render' : 'Railway',
      url: hasLongRunningWork ? platformLinks.render : platformLinks.railway,
      reason: hasLongRunningWork
        ? 'Best fit because this project may need a persistent server, workers, scheduled jobs, WebSockets, or Docker-style deployment.'
        : 'Best fit because this project has backend and database needs that are easier to run together on Railway.',
      bestFor: hasLongRunningWork
        ? ['Docker apps', 'WebSockets', 'background workers', 'persistent backend services']
        : ['Node/Python backends', 'Postgres services', 'API plus database projects'],
      watchOut: hasLongRunningWork
        ? 'Free instances may sleep or have resource limits. Use a paid instance for production demos that must stay awake.'
        : 'Railway free credits are limited, so monitor usage before sharing the app widely.',
      commands: hasLongRunningWork ? platformCommands.render : platformCommands.railway,
      alternatives: [
        { name: 'Vercel', reason: 'Better if the backend is only Next.js API routes.' },
        { name: 'Render', reason: 'Good when you need a more traditional always-on web service.' }
      ]
    }
  }

  if (isStatic) {
    return {
      platform: 'Netlify',
      url: platformLinks.netlify,
      reason: 'Best fit because this looks like a static or mostly frontend project where fast Git-based hosting is enough.',
      bestFor: ['Static React sites', 'landing pages', 'portfolio projects', 'simple forms'],
      watchOut: 'Move to Vercel or Render if the app later adds heavy server logic or database-backed API routes.',
      commands: platformCommands.netlify,
      alternatives: [
        { name: 'Vercel', reason: 'Excellent if you are using Next.js.' },
        { name: 'Cloudflare Pages', reason: 'Strong option for global static hosting.' }
      ]
    }
  }

  if (isNext || savedPlatform.toLowerCase().includes('vercel')) {
    return {
      platform: 'Vercel',
      url: platformLinks.vercel,
      reason: project?.stack?.deployment?.reason || 'Best fit for this project because Vercel gives zero-config Next.js deploys, preview URLs, env vars, serverless API routes, and automatic GitHub deployments.',
      bestFor: ['Next.js apps', 'React dashboards', 'serverless API routes', 'fast demos and mentor reviews'],
      watchOut: hasDatabase ? 'Keep database credentials in Vercel environment variables and confirm production database rules before sharing.' : 'Add environment variables before redeploying, especially API keys.',
      commands: platformCommands.vercel,
      alternatives: [
        { name: 'Railway', reason: 'Better for a separate backend plus database service.' },
        { name: 'Netlify', reason: 'Good for simpler static frontend projects.' }
      ]
    }
  }

  return {
    platform: savedPlatform,
    url: platformLinks[savedPlatform.toLowerCase()] || platformLinks.vercel,
    reason: project?.stack?.deployment?.reason || 'Best fit from your selected architecture stack.',
    bestFor: ['Your selected project stack', 'GitHub-based deployments', 'quick project demos'],
    watchOut: 'Before going live, add environment variables, run a production build, and test auth, database, and AI routes on the deployed URL.',
    commands: platformCommands[savedPlatform.toLowerCase()] || ['# Connect your GitHub repository directly on the platform dashboard', '# Select the main branch', '# Click Deploy'],
    alternatives: [
      { name: 'Vercel', reason: 'Best default for Next.js and React apps.' },
      { name: 'Render', reason: 'Good default for backend services.' }
    ]
  }
}

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

  const deploymentRecommendation = getDeploymentRecommendation(project)
  const recommendedPlatform = deploymentRecommendation.platform
  const platformUrl = deploymentRecommendation.url

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
      commands: deploymentRecommendation.commands,
      notes: `${recommendedPlatform} is recommended for this project. ${deploymentRecommendation.watchOut}`
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
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px', fontFamily: 'DM Mono, monospace' }}>Recommended Platform</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px', fontFamily: 'Syne, sans-serif' }}>{recommendedPlatform}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55 }}>{deploymentRecommendation.reason}</div>
          </div>
          <a 
            href={platformUrl}
            target="_blank" 
            rel="noreferrer"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
              background: 'var(--text-heading)', color: 'var(--bg)', textDecoration: 'none', 
              borderRadius: '12px', fontSize: '14px', fontWeight: 700, transition: 'all 0.2s',
              fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', whiteSpace: 'nowrap'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Open {recommendedPlatform} <ExternalLink size={16} />
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'DM Mono, monospace' }}>Best for this project</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {deploymentRecommendation.bestFor.map(item => (
                <span key={item} style={{ fontSize: '12px', color: 'var(--accent-teal)', background: 'var(--focus)', border: '1px solid var(--border-subtle)', borderRadius: '999px', padding: '6px 10px', fontWeight: 700 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'DM Mono, monospace' }}>Other good options</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {deploymentRecommendation.alternatives.map(item => (
                <div key={item.name} style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-heading)' }}>{item.name}:</strong> {item.reason}
                </div>
              ))}
            </div>
          </div>
        </div>
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
