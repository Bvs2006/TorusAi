'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/utils/firebase/client'

interface StepDetailsProps {
  phaseId: number
  projectId?: string
}

type StepData = {
  id: string;
  title: string;
  tool: string;
  why: string;
  guide: string;
  prompt: string;
  expected: string;
  tips: string[];
  documentation?: string;
};

type PhaseData = {
  title: string;
  steps: StepData[];
};

const PHASES: PhaseData[] = [
  {
    title: 'Setup ide',
    steps: [
      {
        id: '1',
        title: 'Configure Cursor / Windsurf',
        tool: 'Cursor IDE',
        why: 'AI-first IDE speeds up coding and understands your entire codebase out of the box.',
        guide: 'Download Cursor, open your empty project folder, and use CMD/CTRL + L or CMD/CTRL + I to start prompting the AI directly within the editor.',
        prompt: 'I am starting a new project. What are the best settings and extensions to install for a Next.js, Firebase, and TailwindCSS stack?',
        expected: 'A list of recommended settings, extensions, and a quick-start checklist.',
        tips: ['Make sure to log in to enable premium AI models.', 'Use the Composer feature for multi-file edits.'],
        documentation: 'https://docs.cursor.com/'
      }
    ]
  },
  {
    title: 'Environment Setup',
    steps: [
      {
        id: '1',
        title: 'Initialize Next.js Project',
        tool: 'v0.dev / Terminal',
        why: 'Fastest way to get a complete Next.js boilerplate with Tailwind and TypeScript.',
        guide: 'Open your terminal in Cursor, paste the prompt below to get the exact command to run, and follow the setup instructions.',
        prompt: 'Generate the terminal commands to create a new Next.js 14 app with App Router, TailwindCSS, and TypeScript. Also include the command to install Firebase, Lucide React, and Framer Motion.',
        expected: 'Exact terminal commands to run and file structure overview.',
        tips: ['Always choose App Router when prompted by create-next-app.', 'Keep your package.json clean and organized.'],
        documentation: 'https://nextjs.org/docs'
      }
    ]
  },
  {
    title: 'Frontend Development',
    steps: [
      {
        id: '1',
        title: 'Create Layout & Navigation',
        tool: 'v0.dev',
        why: 'v0 generates stunning, accessible, and responsive React UI components instantly.',
        guide: 'Go to v0.dev, paste the prompt to generate the layout, and copy the resulting React component code into your project.',
        prompt: 'Create a modern, responsive sidebar navigation and top header layout for a SaaS dashboard. Use Tailwind CSS and Lucide React icons. It should have a dark mode aesthetic with glassmorphism effects.',
        expected: 'A fully functional React component with Tailwind classes that you can copy directly into your layout.tsx file.',
        tips: ['Ask v0 to iterate on the design if it does not match exactly.', 'Ensure you have the required lucide-react icons installed.'],
        documentation: 'https://v0.dev/faq'
      }
    ]
  },
  {
    title: 'Backend Development',
    steps: [
      {
        id: '1',
        title: 'Design API Architecture',
        tool: 'Cursor Composer',
        why: 'Cursor can see your frontend code and perfectly match the backend API structure to it.',
        guide: 'Open Cursor Composer (CMD/CTRL + I), reference your frontend files, and ask it to build the corresponding Next.js API routes.',
        prompt: 'Look at my frontend components in the /app folder. Generate the Next.js API route handlers (Route Handlers in the App Router) needed to support fetching and updating this data.',
        expected: 'Complete API route files (route.ts) with proper HTTP methods (GET, POST) and error handling.',
        tips: ['Specify if you need Edge runtime or Node.js runtime.', 'Ask for Zod validation for all incoming POST requests.'],
        documentation: 'https://docs.cursor.com/composer/overview'
      }
    ]
  },
  {
    title: 'Database Integration',
    steps: [
      {
        id: '1',
        title: 'Setup Firebase Firestore',
        tool: 'Firebase Console / Cursor',
        why: 'Firebase provides a seamless NoSQL database with real-time listeners and easy Next.js integration.',
        guide: 'Create a project in the Firebase Console, get your config, and use Cursor to generate the connection and utility files.',
        prompt: 'I need to connect my Next.js App Router project to Firebase Firestore. Generate the firebase/client.ts initialization file, and provide a utility function to fetch a collection of items.',
        expected: 'A configured firebase initialization script and data fetching utilities.',
        tips: ['Ensure your Firebase config variables are stored in .env.local', 'Do not expose your private Admin SDK keys in the client code.'],
        documentation: 'https://firebase.google.com/docs/firestore'
      }
    ]
  },
  {
    title: 'Authentication',
    steps: [
      {
        id: '1',
        title: 'Implement Firebase Auth',
        tool: 'Cursor IDE',
        why: 'Cursor can perfectly integrate Firebase Auth state into your Next.js application using React Context.',
        guide: 'Ask Cursor to generate an AuthProvider context and the login/signup API routes.',
        prompt: 'Write a complete Firebase Authentication flow for Next.js App Router. Create an AuthContext provider, a useAuth hook, and a Login page component with Google Sign-in and Email/Password options using TailwindCSS.',
        expected: 'AuthContext file, useAuth hook, and a beautifully styled Login page component.',
        tips: ['Remember to enable Google and Email providers in your Firebase Console.', 'Use middleware.ts to protect private routes.'],
        documentation: 'https://firebase.google.com/docs/auth'
      }
    ]
  },
  {
    title: 'AI Feature Integration',
    steps: [
      {
        id: '1',
        title: 'Connect LLM API',
        tool: 'Groq / Cursor',
        why: 'Groq provides incredibly fast AI inference which is essential for responsive AI features.',
        guide: 'Get your API key from Groq Console, and ask Cursor to build an AI route handler.',
        prompt: 'Create a Next.js API route that connects to the Groq API (using the groq-sdk). It should take a user prompt from the request body, send it to the llama3-70b-8192 model, and return the streaming response.',
        expected: 'An API route handling the Groq connection and returning a readable stream.',
        tips: ['Use the AI SDK by Vercel (ai package) for easy UI streaming.', 'Always handle rate limits gracefully.'],
        documentation: 'https://console.groq.com/docs/quickstart'
      }
    ]
  },
  {
    title: 'Testing',
    steps: [
      {
        id: '1',
        title: 'Write Core Unit Tests',
        tool: 'Cursor Chat',
        why: 'AI is excellent at generating repetitive unit tests and finding edge cases.',
        guide: 'Select your critical utility functions or components, and ask Cursor to generate Jest or Vitest tests for them.',
        prompt: 'Generate comprehensive unit tests for this utility function using Vitest. Include tests for edge cases, null inputs, and expected successful outputs.',
        expected: 'A complete .test.ts file covering all branches of your function.',
        tips: ['Review the generated tests to ensure they are testing actual logic, not just mocking everything.', 'Keep tests fast and isolated.'],
        documentation: 'https://docs.cursor.com/chat/overview'
      }
    ]
  },

  {
    title: 'Documentation',
    steps: [
      {
        id: '1',
        title: 'Generate README.md',
        tool: 'Cursor Composer',
        why: 'Cursor has full context of your completed project and can write accurate documentation automatically.',
        guide: 'Ask Cursor to review your codebase and draft a professional README.',
        prompt: 'Review my entire codebase and generate a comprehensive README.md. Include a project description, feature list, tech stack, local setup instructions, and deployment guide.',
        expected: 'A beautifully formatted markdown file documenting your project.',
        tips: ['Add screenshots of your application to the README.', 'Include a license and contact information.'],
        documentation: 'https://docs.cursor.com/composer/overview'
      }
    ]
  }
];

export default function StepDetails({ phaseId, projectId }: StepDetailsProps) {
  const phase = PHASES[phaseId - 1] || PHASES[0]
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    if (!projectId) return
    getDoc(doc(db as any, 'projects', projectId)).then(snap => {
      if (snap.exists()) setProject(snap.data())
    })
  }, [projectId])

  // Error Assistant Modal State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [language, setLanguage] = useState('TypeScript/Next.js')
  const [context, setContext] = useState('')
  const [result, setResult] = useState<{ explanation: string; steps: string[]; fixedPrompt: string; relatedDocs?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleFix(e: React.FormEvent) {
    e.preventDefault()
    if (!errorText.trim()) { alert('⚠️ Paste an error message first'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorText, language, context, stack: project?.stack })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2500)
  }

  function copyPrompt(p: string) {
    navigator.clipboard.writeText(p)
    alert('Prompt copied')
  }

  function openTool(toolName: string) {
    const lower = toolName.toLowerCase()
    let url = 'https://google.com/search?q=' + encodeURIComponent(toolName)
    
    if (lower.includes('cursor')) url = 'https://cursor.com'
    else if (lower.includes('windsurf')) url = 'https://codeium.com/windsurf'
    else if (lower.includes('v0')) url = 'https://v0.dev'
    else if (lower.includes('firebase')) url = 'https://console.firebase.google.com'
    else if (lower.includes('groq')) url = 'https://console.groq.com'
    else if (lower.includes('vercel')) url = 'https://vercel.com'
    
    window.open(url, '_blank')
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>{phase.title}</h2>
      <div style={{ marginTop: 8, color: '#6b7280', fontSize: 14 }}>
        This guide follows your selected architecture. Phase {phaseId} contains {phase.steps.length} step(s).
      </div>

      <div style={{ marginTop: 24, display: 'grid', gap: 24 }}>
        {phase.steps.map((s, idx) => (
          <div key={s.id} style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f3f4f6', paddingBottom: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  Step {idx + 1}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  {s.title}
                </div>
                <div style={{ color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>Tool:</span> {s.tool}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setCompletedSteps(prev => ({ ...prev, [s.id]: !prev[s.id] }))} style={{ padding: '8px 12px', borderRadius: 8, background: completedSteps[s.id] ? '#10b981' : '#f3f4f6', color: completedSteps[s.id] ? '#fff' : '#374151', border: '1px solid', borderColor: completedSteps[s.id] ? '#059669' : '#e5e7eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {completedSteps[s.id] ? '✓ Completed' : 'Mark Completed'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              {/* Why this tool */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Why this tool is best</div>
                <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.5 }}>{s.why}</div>
              </div>
              
              {/* Expected Output */}
              <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: 6 }}>Expected Output</div>
                <div style={{ fontSize: 14, color: '#15803d', lineHeight: 1.5 }}>{s.expected}</div>
              </div>
            </div>

            {/* AI Integration Guide Section */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#3b82f6', color: '#fff', width: 24, height: 24, borderRadius: '50%', fontSize: 12 }}>✨</span>
                AI Tool Integration Guide
              </div>
              <div style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.6, background: '#eff6ff', padding: 16, borderRadius: 8, borderLeft: '4px solid #3b82f6' }}>
                {s.guide}
              </div>
            </div>

            {/* Prompt Block */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Ready-made Prompt</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openTool(s.tool)} style={{ padding: '6px 12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Open {s.tool} ↗
                  </button>
                  <button onClick={() => copyPrompt(s.prompt)} style={{ padding: '6px 12px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Copy Prompt
                  </button>
                </div>
              </div>
              <div style={{ background: '#0f172a', color: '#e2e8f0', padding: 20, borderRadius: 8, fontSize: 14, fontFamily: 'monospace', lineHeight: 1.6, overflowX: 'auto', border: '1px solid #334155' }}>
                {s.prompt}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Tips & Warnings */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309', textTransform: 'uppercase', marginBottom: 8 }}>Tips & Warnings</div>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#78350f', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {s.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Documentation */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Tool Documentation</div>
                {s.documentation ? (
                  <a href={s.documentation} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    Read Official Docs
                  </a>
                ) : (
                  <div style={{ color: '#6b7280', fontSize: 13, background: '#f3f4f6', padding: '8px 12px', borderRadius: 6, display: 'inline-block' }}>
                    No specific documentation link provided.
                  </div>
                )}
              </div>
            </div>

            {/* Error Fixer Link */}
            <div style={{ marginTop: 24, padding: 16, background: '#fff1f2', borderRadius: 8, border: '1px solid #ffe4e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#be123c', marginBottom: 4 }}>Got an error during this step?</div>
                <div style={{ fontSize: 13, color: '#9f1239' }}>Use our AI Error Fix Assistant to instantly debug and generate a fix prompt.</div>
              </div>
              <button onClick={() => setShowErrorModal(true)} style={{ padding: '8px 16px', background: '#e11d48', color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(225,29,72,.2)' }}>
                <span>🔧</span> Ask Error Bot ↗
              </button>
            </div>

          </div>
        ))}
      </div>

      {phaseId < PHASES.length && (
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href={`/planner/architecture/guide?project=${projectId}`}
            style={{
              padding: '10px 18px', background: '#f3f4f6', color: '#374151',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              border: '1px solid #e5e7eb'
            }}
          >
            ← Back to All Phases
          </Link>
          <Link 
            href={`/planner/architecture/guide/step/${phaseId + 1}?project=${projectId}`} 
            style={{ 
              padding: '12px 24px', background: '#0f766e', 
              border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', 
              fontSize: '14px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', 
              alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(15,118,110,.2)' 
            }}
          >
            Next Phase →
          </Link>
        </div>
      )}

      {phaseId === PHASES.length && (
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href={`/planner/architecture/guide?project=${projectId}`}
            style={{
              padding: '10px 18px', background: '#f3f4f6', color: '#374151',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              border: '1px solid #e5e7eb'
            }}
          >
            ← Back to All Phases
          </Link>
          <Link 
            href={`/planner/deploy?project=${projectId}`} 
            style={{ 
              padding: '12px 24px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', 
              border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', 
              fontSize: '14px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', 
              alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(66,127,131,.28)' 
            }}
          >
            Continue to Deployment Guide →
          </Link>
        </div>
      )}

      {/* Error Fixer Modal */}
      {showErrorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowErrorModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '6px', color: '#172326' }}>🔧 Error Fix Assistant</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>Paste your error message to get a plain-English explanation and fix prompt.</p>

            <form onSubmit={handleFix}>
               <textarea placeholder="Paste your full error message here..." value={errorText} onChange={e => setErrorText(e.target.value)} style={{ width: '100%', minHeight: '120px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical' }} />
               <div style={{ marginBottom: '24px' }}>
                 <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Context (optional)</label>
                 <input value={context} onChange={e => setContext(e.target.value)} placeholder="What were you trying to do?" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
               </div>
               <button type="submit" disabled={loading || !errorText.trim()} style={{ width: '100%', padding: '12px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: loading || !errorText.trim() ? 'not-allowed' : 'pointer', opacity: (!errorText.trim() || loading) ? 0.7 : 1 }}>
                 {loading ? 'Analyzing Error...' : 'Analyze & Fix Error'}
               </button>
            </form>

            {result && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease-out' }}>
                <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>💡 What went wrong</div>
                  <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>{result.explanation}</div>
                </div>
                <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: 700, color: '#166534', marginBottom: '8px', fontSize: '14px' }}>✨ Fixed Prompt (Paste to IDE)</div>
                  <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', position: 'relative', border: '1px solid #334155' }}>
                    <button onClick={() => copyText(result.fixedPrompt, 'prompt')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>{copied === 'prompt' ? '✓ Copied!' : 'Copy'}</button>
                    {result.fixedPrompt}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
