'use client'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore'
import { auth, db } from '@/utils/firebase/client'
// app/(app)/planner/blueprint/page.tsx — Step 5: Blueprint
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepIndicator, showToast } from '@/components/ui'
import { Copy, Check, ArrowRight } from 'lucide-react'
import type { Project } from '@/types'

const STEPS = ['Idea', 'Features', 'Architecture', 'Prompts', 'Blueprint', 'Deploy']

export default function BlueprintPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'files' | 'api' | 'db' | 'env' | 'stack'>('files')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) { router.push('/planner'); return }
    getDoc(doc(db as any, 'projects', projectId!)).then(s => { if (s.exists()) setProject({ id: s.id, ...s.data() as any }); setLoading(false) })
  }, [projectId])

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key); showToast('✓ Copied!')
    setTimeout(() => setCopied(null), 2500)
  }

  if (loading || !project) return (
    <div style={{ padding: '28px 32px', color: '#607276' }}>Loading blueprint...</div>
  )

  const stack = project.stack
  const fe = stack?.frontend?.name || 'Next.js'
  const db = stack?.database?.name || 'Supabase'
  const auth = stack?.auth?.name || 'Supabase Auth'
  const slg = project.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const fileStructure = `${slg}/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── [feature]/page.tsx
│   ├── api/
│   │   ├── [route]/route.ts
│   │   └── auth/callback/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── [Feature].tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── .env.local
├── package.json
└── README.md`

  const apiRoutes = [
    { method: 'GET', route: '/api/user', description: 'Get current user profile', auth: 'Required' },
    { method: 'PATCH', route: '/api/user', description: 'Update user profile', auth: 'Required' },
    { method: 'GET', route: '/api/projects', description: 'List all user projects', auth: 'Required' },
    { method: 'POST', route: '/api/projects', description: 'Create new project', auth: 'Required' },
    { method: 'GET', route: '/api/projects/[id]', description: 'Get project by ID', auth: 'Required' },
    { method: 'PATCH', route: '/api/projects/[id]', description: 'Update project', auth: 'Required' },
    { method: 'DELETE', route: '/api/projects/[id]', description: 'Delete project', auth: 'Required' },
    { method: 'GET', route: '/api/projects/[id]/features', description: 'Get project features', auth: 'Required' },
    { method: 'POST', route: '/api/projects/[id]/features', description: 'Add feature', auth: 'Required' },
  ]

  const dbSchema = `-- Core tables for ${project.name}

CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own data"
  ON items FOR ALL USING (auth.uid() = user_id);`

  const envVars = `# ${project.name} — Environment Variables

# ${db}
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# AI (Groq)
GROQ_API_KEY=gsk_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-char-secret-here`

  const tabs = [
    { key: 'files', label: '📁 File Structure' },
    { key: 'api', label: '⚡ API Routes' },
    { key: 'db', label: '🗄️ DB Schema' },
    { key: 'env', label: '🔑 Env Vars' },
    { key: 'stack', label: '🛠️ Tech Stack' },
  ] as const

  const methodColor = (m: string) => ({
    GET: { bg: 'rgba(16,185,129,.1)', color: '#10b981' },
    POST: { bg: 'rgba(66,127,131,.1)', color: '#5aa0a4' },
    PATCH: { bg: 'rgba(245,158,11,.1)', color: '#f59e0b' },
    DELETE: { bg: 'rgba(244,63,94,.1)', color: '#f43f5e' },
  }[m] || { bg: 'rgba(6,182,212,.1)', color: '#06b6d4' })

  return (
    <div style={{ padding: '28px 32px', maxWidth: '900px' }}>
      <StepIndicator steps={STEPS} current={4} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>
            Blueprint — <span style={{ color: '#5aa0a4' }}>{project.name}</span>
          </h1>
          <p style={{ color: '#607276', fontSize: '13px' }}>Auto-generated from your stack. Copy any section to use in your project.</p>
        </div>
        <button onClick={() => router.push(`/planner/deploy?project=${projectId}`)}
          style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Deploy Guide <ArrowRight size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(38,69,72,.12)', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'DM Sans, sans-serif', transition: 'all .15s',
            color: activeTab === tab.key ? '#83b9bd' : '#607276',
            borderBottom: `2px solid ${activeTab === tab.key ? '#427f83' : 'transparent'}`,
            marginBottom: '-1px'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'files' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button onClick={() => copy(fileStructure, 'files')} style={{ padding: '5px 12px', background: 'rgba(66,127,131,.15)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '7px', color: '#83b9bd', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace' }}>
              {copied === 'files' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
            </button>
          </div>
          <pre style={{ background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', padding: '20px', fontSize: '12px', color: '#83b9bd', fontFamily: 'DM Mono, monospace', lineHeight: '1.7', overflowX: 'auto' }}>
            {fileStructure}
          </pre>
        </div>
      )}

      {activeTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {apiRoutes.map((route, i) => {
            const mc = methodColor(route.method)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '10px', padding: '11px 14px' }}>
                <span style={{ padding: '2px 8px', background: mc.bg, color: mc.color, borderRadius: '4px', fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 700, flexShrink: 0, minWidth: '50px', textAlign: 'center' }}>
                  {route.method}
                </span>
                <code style={{ flex: 1, fontSize: '12px', color: '#83b9bd', fontFamily: 'DM Mono, monospace' }}>
                  {route.route}
                </code>
                <span style={{ flex: 2, fontSize: '12px', color: '#607276' }}>{route.description}</span>
                <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#8a9a9d', flexShrink: 0 }}>{route.auth}</span>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'db' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button onClick={() => copy(dbSchema, 'db')} style={{ padding: '5px 12px', background: 'rgba(66,127,131,.15)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '7px', color: '#83b9bd', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace' }}>
              {copied === 'db' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy SQL</>}
            </button>
          </div>
          <pre style={{ background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', padding: '20px', fontSize: '12px', color: '#83b9bd', fontFamily: 'DM Mono, monospace', lineHeight: '1.7', overflowX: 'auto' }}>
            {dbSchema}
          </pre>
        </div>
      )}

      {activeTab === 'env' && (
        <div>
          <div style={{ background: 'rgba(244,63,94,.08)', border: '1px solid rgba(244,63,94,.2)', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px', fontSize: '12px', color: '#f43f5e' }}>
            🔒 Never commit .env.local to Git. Add to .gitignore immediately.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button onClick={() => copy(envVars, 'env')} style={{ padding: '5px 12px', background: 'rgba(66,127,131,.15)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '7px', color: '#83b9bd', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace' }}>
              {copied === 'env' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy .env</>}
            </button>
          </div>
          <pre style={{ background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', padding: '20px', fontSize: '12px', color: '#83b9bd', fontFamily: 'DM Mono, monospace', lineHeight: '1.8', overflowX: 'auto' }}>
            {envVars}
          </pre>
        </div>
      )}

      {activeTab === 'stack' && stack && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {Object.entries(stack).map(([key, item]: any) => (
            <div key={key} style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{key}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{item.name}</div>
              <p style={{ fontSize: '12px', color: '#607276', lineHeight: '1.5', marginBottom: '8px' }}>{item.reason}</p>
              <span style={{ padding: '2px 8px', background: item.free ? 'rgba(16,185,129,.1)' : 'rgba(244,63,94,.1)', border: `1px solid ${item.free ? 'rgba(16,185,129,.3)' : 'rgba(244,63,94,.3)'}`, borderRadius: '4px', fontSize: '10px', color: item.free ? '#10b981' : '#f43f5e', fontFamily: 'DM Mono, monospace' }}>
                {item.free ? '✓ Free tier' : '$ Paid'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
