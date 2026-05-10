'use client'
import { auth } from '@/utils/firebase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowUp, Briefcase, Cpu, Layers, Wand2 } from 'lucide-react'
import { showToast } from '@/components/ui'

const SUGGESTIONS = [
  'A SaaS dashboard for tracking team performance with AI insights',
  'An e-commerce platform with personalized product recommendations',
  'A real-time collaboration tool for remote engineering teams',
  'A mobile-first habit tracker with streak analytics',
]

export default function PlannerPage() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [experience, setExperience] = useState('intermediate')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim()) return
    setLoading(true)

    try {
      const user = auth.currentUser
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, experience, platform: 'web', userId: user?.uid || null })
      })
      const plan = await res.json()
      if (plan.error) throw new Error(plan.error)
      showToast('✓ Build plan generated! Moving to features...')
      router.push(`/planner/features?project=${plan.projectId}`)
    } catch (err: any) {
      showToast(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 58px)',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dynamic Background Gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(131,185,189,0.15) 0%, transparent 60%)',
        zIndex: 0
      }} />

      {/* Subtle background torus rings */}
      <div className="bg-ring ring-a" />
      <div className="bg-ring ring-b" />

      {/* Header */}
      <div style={{
        textAlign: 'center', marginBottom: '40px',
        animation: 'fadeSlideUp 0.5s ease both',
        position: 'relative', zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '5px 14px',
          background: 'rgba(66,127,131,0.08)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: 600,
          color: 'var(--accent-teal)', marginBottom: '20px',
          textTransform: 'uppercase', letterSpacing: '1.2px'
        }}>
          <Wand2 size={12} />
          AI Architecture Planner
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-1.5px',
          margin: '0 0 14px',
          color: 'var(--text-heading)',
        }}>
          Let's build something<br />
          <span style={{ color: 'var(--accent-teal)' }}>extraordinary.</span>
        </h1>

        <p style={{
          color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.6,
          maxWidth: '480px', margin: '0 auto'
        }}>
          Describe your idea. Torus AI will design the perfect architecture, stack, and roadmap.
        </p>
      </div>

      {/* Main card */}
      <form
        onSubmit={handleGenerate}
        style={{
          width: '100%', maxWidth: '800px',
          animation: 'fadeSlideUp 0.5s ease 0.1s both',
          position: 'relative', zIndex: 1
        }}
      >
        <div style={{
          background: 'var(--surface-overlay)',
          backdropFilter: 'var(--glass-blur)',
          border: `1px solid ${focused ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
          borderRadius: '24px',
          padding: '28px 28px 20px',
          boxShadow: focused
            ? '0 0 0 4px rgba(66,127,131,0.08), 0 20px 48px rgba(0,0,0,0.2)'
            : '0 20px 48px rgba(0,0,0,0.1)',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)'
        }}>

          {/* Textarea */}
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask Torus AI to build an internal tool that..."
            rows={5}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', color: 'var(--text-heading)',
              fontSize: '17px', outline: 'none', resize: 'none',
              fontFamily: 'DM Sans, sans-serif', lineHeight: '1.7',
              caretColor: 'var(--accent-teal)',
            }}
            autoFocus
          />

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '16px 0' }} />

          {/* Bottom bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '16px'
          }}>

            {/* Experience level */}
            <div>
              <label style={{
                display: 'block', fontSize: '10px', color: 'var(--text-muted)',
                fontFamily: 'DM Mono, monospace', textTransform: 'uppercase',
                letterSpacing: '1.2px', marginBottom: '9px', fontWeight: 600
              }}>
                Experience Level
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => {
                  const active = experience === lvl.toLowerCase()
                  return (
                    <button
                      key={lvl} type="button"
                      onClick={() => setExperience(lvl.toLowerCase())}
                      style={{
                        padding: '7px 14px',
                        background: active
                          ? 'rgba(66,127,131,0.12)'
                          : 'var(--bg-2)',
                        border: `1px solid ${active ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                        borderRadius: '8px',
                        color: active ? 'var(--accent-teal)' : 'var(--text-muted)',
                        fontSize: '12px', fontWeight: active ? 700 : 500,
                        cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      {lvl}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="submit-btn"
              style={{
                width: '48px', height: '48px', flexShrink: 0,
                background: idea.trim() && !loading
                  ? 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))'
                  : 'var(--bg-2)',
                border: `1px solid ${idea.trim() && !loading ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                borderRadius: '14px',
                color: idea.trim() && !loading ? '#fff' : 'var(--text-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: loading || !idea.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: idea.trim() && !loading
                  ? '0 4px 16px rgba(66,127,131,0.3)'
                  : 'none'
              }}
            >
              {loading ? (
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite'
                }} />
              ) : (
                <ArrowUp size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap',
          marginTop: '14px',
          animation: 'fadeSlideUp 0.5s ease 0.2s both'
        }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i} type="button"
              onClick={() => setIdea(s)}
              className="suggestion-chip"
              style={{
                padding: '6px 14px',
                background: 'var(--surface-overlay)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                color: 'var(--text-muted)',
                fontSize: '12px', cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'DM Sans, sans-serif',
                whiteSpace: 'nowrap', overflow: 'hidden',
                maxWidth: '260px', textOverflow: 'ellipsis',
                backdropFilter: 'var(--glass-blur)'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {/* Footer badges */}
      <div style={{
        marginTop: '40px',
        display: 'flex', gap: '24px',
        color: 'var(--text-subtle)', fontSize: '12px',
        fontFamily: 'DM Mono, monospace',
        animation: 'fadeSlideUp 0.5s ease 0.3s both',
        position: 'relative', zIndex: 1
      }}>
        {[
          { icon: <Sparkles size={13} />, label: 'AI Powered Planning' },
          { icon: <Layers size={13} />, label: 'Full Stack Architecture' },
          { icon: <Cpu size={13} />, label: 'LLM-Optimized Prompts' },
        ].map((b, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {b.icon} {b.label}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .bg-ring {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .ring-a {
          width: 500px; height: 500px;
          border: 48px solid rgba(90,160,164,0.05);
          top: -180px; left: -160px;
          animation: slowSpin 40s linear infinite;
        }
        .ring-b {
          width: 380px; height: 380px;
          border: 36px solid rgba(66,127,131,0.04);
          bottom: -120px; right: -100px;
          animation: slowSpin 55s linear infinite reverse;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 24px rgba(66,127,131,0.4) !important;
        }
        .suggestion-chip:hover {
          background: rgba(66,127,131,0.08) !important;
          border-color: var(--accent-teal) !important;
          color: var(--accent-teal) !important;
        }
        ::placeholder { color: var(--text-subtle) !important; opacity: 0.5; }
      `}</style>
    </div>
  )
}
