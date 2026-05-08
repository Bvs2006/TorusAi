'use client'
// app/(app)/planner/deploy/page.tsx — Step 6: Deploy Guide
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { StepIndicator, showToast } from '@/components/ui'
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react'

const STEPS = ['Idea', 'Features', 'Architecture', 'Prompts', 'Blueprint', 'Deploy']

const DEPLOY_STEPS = [
  {
    n: 1, title: 'Push to GitHub', emoji: '🐙',
    commands: ['git init', 'git add .', 'git commit -m "Initial commit"', 'git remote add origin https://github.com/youruser/your-project.git', 'git push -u origin main'],
    notes: 'Create a new repo on github.com first, then run these commands in your project folder.'
  },
  {
    n: 2, title: 'Set up Supabase', emoji: '🔵',
    commands: ['# Go to supabase.com', '# Create new project', '# Copy URL + anon key + service role key', '# Go to SQL Editor and run db/migrations.sql', '# Enable Google OAuth in Authentication → Providers'],
    notes: 'In Supabase Auth settings, add your Vercel URL to "Site URL" and "/api/auth/callback" to redirect URLs.'
  },
  {
    n: 3, title: 'Deploy SearXNG (web search)', emoji: '🔍',
    commands: ['# Option A: Railway (recommended)', '# railway.app → New → Deploy from Docker', '# Image: searxng/searxng', '# Add env: SEARXNG_SECRET_KEY=<random 32 chars>', '', '# Option B: Local dev only', 'docker run -d -p 8080:8080 searxng/searxng'],
    notes: 'SearXNG powers the live tool search. Without it, Torus AI falls back to preset tool suggestions.'
  },
  {
    n: 4, title: 'Deploy to Vercel', emoji: '▲',
    commands: ['npm install -g vercel', 'vercel', '# Or: connect GitHub repo at vercel.com', '# Vercel auto-deploys on every git push'],
    notes: 'Vercel auto-detects Next.js. No config needed. Add all .env.local variables in Vercel → Settings → Environment Variables.'
  },
  {
    n: 5, title: 'Set Environment Variables', emoji: '🔑',
    commands: ['# In Vercel Dashboard → Settings → Environment Variables', 'NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co', 'NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...', 'SUPABASE_SERVICE_ROLE_KEY=eyJ...', 'GROQ_API_KEY=gsk_...', 'SEARXNG_BASE_URL=https://your-searxng.railway.app', 'NEXT_PUBLIC_APP_URL=https://your-project.vercel.app'],
    notes: 'Never put keys in your code. Always use environment variables. Redeploy after adding env vars.'
  },
  {
    n: 6, title: 'Verify & Go Live', emoji: '🚀',
    checklist: [
      'Visit your Vercel URL — app loads without errors',
      'Sign up with email works',
      'Google OAuth works (if configured)',
      'Create a project → AI generates a plan',
      'Error pages redirect to login',
      'Supabase dashboard shows new rows being created',
    ],
    notes: 'Your app is live! Share the URL and start building.'
  },
]

export default function DeployPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const [expanded, setExpanded] = useState<number>(1)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [checklist, setChecklist] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)

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
    if (!done.has(n) && n < DEPLOY_STEPS.length) {
      setTimeout(() => setExpanded(n + 1), 300)
    }
  }

  const allDone = DEPLOY_STEPS.filter(s => !s.checklist).every(s => done.has(s.n))
  const checklistItems = DEPLOY_STEPS.find(s => s.checklist)?.checklist || []
  const allChecked = checklistItems.every(item => checklist.has(item))

  return (
    <div style={{ padding: '28px 32px', maxWidth: '760px' }}>
      <StepIndicator steps={STEPS} current={5} />
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>
          🚀 Deployment Guide
        </h1>
        <p style={{ color: '#607276', fontSize: '13px' }}>
          {done.size}/{DEPLOY_STEPS.length} steps complete · Follow these steps to go live for free
        </p>
        <div style={{ height: '4px', background: 'rgba(43,69,72,.12)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(done.size / DEPLOY_STEPS.length) * 100}%`, background: 'linear-gradient(90deg, #427f83, #10b981)', borderRadius: '2px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {DEPLOY_STEPS.map(step => {
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
      {done.size >= 5 && allChecked && (
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.1), rgba(124,58,237,.08))', border: '1px solid rgba(16,185,129,.3)', borderRadius: '16px', padding: '28px', textAlign: 'center', marginTop: '10px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>Your project is live!</h2>
          <p style={{ color: '#607276', fontSize: '13px' }}>Share your URL and keep building. You earned the 🚀 First Ship badge!</p>
        </div>
      )}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}
