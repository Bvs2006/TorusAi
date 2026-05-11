'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUp,
  Check,
  Clipboard,
  Copy,
  FileText,
  LayoutGrid,
  Library,
  Loader2,
  Search,
  Sparkles,
  WandSparkles
} from 'lucide-react'
import { showToast } from '@/components/ui'

type PromptTemplate = {
  title: string
  category: string
  description: string
  starter: string
}

type MasterPromptResult = {
  questions: string[]
  sections: string[]
  tips: string[]
  improvedPrompt: string
  ai_provider?: string
  ai_model?: string
}

const categories = [
  'Recommended',
  'General',
  'Sales',
  'Marketing',
  'Product',
  'Engineering',
  'Founder',
  'Operations',
  'Customer Success'
]

const targetModels = ['ChatGPT', 'Claude', 'Gemini', 'Cursor', 'v0', 'Perplexity']

const templates: PromptTemplate[] = [
  {
    title: 'Build a login page',
    category: 'Engineering',
    description: 'Frontend prompt with auth fields, UI states, validation, and responsive layout.',
    starter: 'Create a modern login page for my SaaS app with email/password auth, Google sign in, forgot password, loading states, error states, and mobile responsive UI.'
  },
  {
    title: 'Create a launch email',
    category: 'Marketing',
    description: 'Campaign prompt with audience, offer, tone, subject lines, and CTAs.',
    starter: 'Write a product launch email campaign for a new AI planning tool aimed at solo developers and startup builders.'
  },
  {
    title: 'Plan a dashboard',
    category: 'Product',
    description: 'Turns a dashboard idea into widgets, navigation, filters, and data states.',
    starter: 'Design a project dashboard that shows active projects, progress, AI guide steps, quick tools, and recent activity for developers.'
  },
  {
    title: 'Debug an error',
    category: 'Engineering',
    description: 'Structured debugging prompt for stack traces, reproduction, root cause, and fix.',
    starter: 'Help me debug this Next.js error. Explain the root cause, list likely files to inspect, and give a safe fix plan.'
  },
  {
    title: 'Sales discovery call',
    category: 'Sales',
    description: 'Creates questions, qualification criteria, and follow-up notes.',
    starter: 'Prepare a discovery call guide for a B2B SaaS lead who wants to automate customer support workflows.'
  },
  {
    title: 'Meeting summary',
    category: 'Operations',
    description: 'Converts messy notes into decisions, owners, deadlines, and risks.',
    starter: 'Turn these meeting notes into a concise summary with decisions, action items, owners, due dates, blockers, and next steps.'
  },
  {
    title: 'Investor update',
    category: 'Founder',
    description: 'Clear founder update prompt with metrics, wins, risks, asks, and priorities.',
    starter: 'Draft a monthly investor update for an early-stage AI startup, including traction, product progress, risks, hiring, and asks.'
  },
  {
    title: 'Support response',
    category: 'Customer Success',
    description: 'Creates empathetic support replies with troubleshooting and escalation steps.',
    starter: 'Write a customer support response for a user who cannot access their account after signing up.'
  }
]

export default function MasterPromptPage() {
  const [idea, setIdea] = useState('')
  const [category, setCategory] = useState('Recommended')
  const [targetModel, setTargetModel] = useState('ChatGPT')
  const [answers, setAnswers] = useState('')
  const [search, setSearch] = useState('')
  const [result, setResult] = useState<MasterPromptResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const categoryMatch = category === 'Recommended' || template.category === category
      const query = search.trim().toLowerCase()
      const searchMatch = !query || `${template.title} ${template.description} ${template.category}`.toLowerCase().includes(query)
      return categoryMatch && searchMatch
    })
  }, [category, search])

  async function improvePrompt() {
    if (!idea.trim()) {
      showToast('Add an idea first')
      return
    }

    setLoading(true)
    setCopied(false)
    try {
      const res = await fetch('/api/ai/master-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, category, targetModel, answers })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to improve prompt')
      setResult(data)
    } catch (error: any) {
      showToast(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function copyPrompt() {
    if (!result?.improvedPrompt) return
    await navigator.clipboard.writeText(result.improvedPrompt)
    setCopied(true)
    showToast('Copied prompt')
    setTimeout(() => setCopied(false), 1800)
  }

  function useTemplate(template: PromptTemplate) {
    setIdea(template.starter)
    setCategory(template.category)
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="master-prompt-page">
      <section className="master-hero">
        <div className="title-wrap">
          <div className="eyebrow"><Sparkles size={14} /> Master Prompt</div>
          <h1>Turn rough ideas into copy-ready AI prompts</h1>
          <p>Expand vague thoughts into structured prompts with context, tasks, constraints, objectives, and model-ready output.</p>
        </div>

        <div className="prompt-composer">
          <textarea
            value={idea}
            onChange={event => setIdea(event.target.value)}
            placeholder="Describe what you want AI to do. Example: build a dashboard for my project planner..."
            rows={6}
          />
          <div className="composer-bar">
            <div className="field-row">
              <label>Prompt type</label>
              <select value={category} onChange={event => setCategory(event.target.value)}>
                {categories.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="field-row">
              <label>Model</label>
              <select value={targetModel} onChange={event => setTargetModel(event.target.value)}>
                {targetModels.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <button className="icon-button" onClick={improvePrompt} disabled={loading || !idea.trim()} aria-label="Improve prompt">
              {loading ? <Loader2 className="spin" size={18} /> : <ArrowUp size={18} />}
            </button>
          </div>
        </div>

        <div className="mode-pills" aria-label="Master prompt modes">
          <span className="active"><FileText size={16} /> Prompt</span>
          <span><LayoutGrid size={16} /> Template</span>
          <span><WandSparkles size={16} /> Agent</span>
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="library-panel">
          <div className="panel-heading">
            <Library size={18} />
            <div>
              <h2>Discover</h2>
              <p>Ready prompts across roles. Pick one and make it yours.</p>
            </div>
          </div>

          <div className="search-box">
            <Search size={16} />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search prompts..." />
          </div>

          <div className="category-tabs">
            {categories.map(item => (
              <button key={item} onClick={() => setCategory(item)} className={category === item ? 'active' : ''}>
                {item}
              </button>
            ))}
          </div>

          <div className="template-grid">
            {filteredTemplates.map(template => (
              <button key={template.title} className="template-card" onClick={() => useTemplate(template)}>
                <span>{template.category}</span>
                <strong>{template.title}</strong>
                <p>{template.description}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="refine-panel">
          <div className="panel-title">
            <div>
              <h2>Refinement</h2>
              <p>Answer the follow-up questions when you want the next version to be sharper.</p>
            </div>
            <button onClick={improvePrompt} disabled={loading || !idea.trim()}>
              {loading ? <Loader2 className="spin" size={16} /> : <WandSparkles size={16} />}
              Improve Prompt
            </button>
          </div>

          <div className="question-list">
            {(result?.questions?.length ? result.questions : [
              'What audience should this prompt target?',
              'What exact output should the AI produce?',
              'What constraints, tools, stack, or tone must it follow?'
            ]).map(question => (
              <div key={question} className="question-item">{question}</div>
            ))}
          </div>

          <textarea
            className="answer-box"
            value={answers}
            onChange={event => setAnswers(event.target.value)}
            placeholder="Optional: answer the questions here, then click Improve Prompt again..."
            rows={4}
          />

          <div className="output-card">
            <div className="output-header">
              <div>
                <span>Copy-ready output</span>
                <h3>Refined prompt</h3>
              </div>
              <button onClick={copyPrompt} disabled={!result?.improvedPrompt}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre>{result?.improvedPrompt || 'Your improved prompt will appear here with role, context, task, constraints, output format, and quality checks.'}</pre>
          </div>

          {result && (
            <div className="insight-row">
              <div>
                <Clipboard size={16} />
                <span>{result.sections?.join(' / ') || 'Structured prompt sections'}</span>
              </div>
              <div>
                <Sparkles size={16} />
                <span>{result.ai_provider ? `${result.ai_provider} - ${result.ai_model}` : 'AI optimized'}</span>
              </div>
            </div>
          )}
        </section>
      </section>

      <style jsx>{`
        .master-prompt-page {
          min-height: 100vh;
          color: #1f2933;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 234, 204, 0.75), transparent 28%),
            radial-gradient(circle at 88% 35%, rgba(255, 212, 166, 0.75), transparent 30%),
            linear-gradient(180deg, #fffefe 0%, #fffaf3 54%, #ffffff 100%);
          padding: 34px 42px 56px;
          font-family: DM Sans, sans-serif;
        }

        .master-hero {
          max-width: 1080px;
          margin: 0 auto 34px;
          text-align: center;
        }

        .title-wrap {
          max-width: 760px;
          margin: 0 auto 24px;
        }

        .eyebrow {
          width: max-content;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid rgba(31, 41, 51, 0.08);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.76);
          color: #0f766e;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        h1 {
          margin: 0;
          color: #202124;
          font-family: Syne, sans-serif;
          font-size: 48px;
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: 0;
        }

        .title-wrap p {
          margin: 14px auto 0;
          color: #5f6368;
          font-size: 18px;
          line-height: 1.5;
        }

        .prompt-composer {
          overflow: hidden;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(31, 41, 51, 0.1);
          border-radius: 16px;
          box-shadow: 0 24px 70px rgba(95, 70, 33, 0.12);
          text-align: left;
        }

        .prompt-composer textarea {
          width: 100%;
          resize: vertical;
          border: 0;
          outline: none;
          min-height: 150px;
          padding: 26px 30px;
          color: #202124;
          background: transparent;
          font: 500 17px/1.6 DM Sans, sans-serif;
        }

        .composer-bar {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 14px 16px 16px 26px;
          border-top: 1px solid rgba(31, 41, 51, 0.07);
        }

        .field-row {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #5f6368;
          font-size: 14px;
          font-weight: 700;
        }

        .field-row select {
          border: 0;
          outline: none;
          background: transparent;
          color: #202124;
          font-weight: 800;
          cursor: pointer;
        }

        .field-row:nth-child(2) {
          margin-left: auto;
        }

        .icon-button,
        .panel-title button,
        .output-header button {
          border: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 800;
          transition: transform 0.18s ease, opacity 0.18s ease;
        }

        .icon-button {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          color: #111827;
          background: #f3f4f6;
        }

        button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .mode-pills {
          width: max-content;
          margin: 20px auto 0;
          display: flex;
          gap: 4px;
          padding: 5px;
          border: 1px solid rgba(31, 41, 51, 0.1);
          border-radius: 999px;
          background: rgba(243, 244, 246, 0.85);
          box-shadow: 0 8px 24px rgba(17, 24, 39, 0.07);
        }

        .mode-pills span {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 999px;
          color: #6b7280;
          font-weight: 800;
        }

        .mode-pills .active {
          color: #111827;
          background: #ffffff;
          box-shadow: 0 3px 10px rgba(17, 24, 39, 0.08);
        }

        .workspace-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.72fr);
          gap: 24px;
          align-items: start;
        }

        .library-panel,
        .refine-panel {
          border: 1px solid rgba(31, 41, 51, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 20px 60px rgba(61, 45, 22, 0.08);
        }

        .library-panel {
          padding: 28px;
        }

        .panel-heading,
        .panel-title,
        .output-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .panel-heading {
          justify-content: flex-start;
          margin-bottom: 18px;
        }

        .panel-heading h2,
        .panel-title h2,
        .output-header h3 {
          margin: 0;
          color: #202124;
          font-family: Syne, sans-serif;
          font-size: 28px;
          letter-spacing: 0;
        }

        .panel-heading p,
        .panel-title p {
          margin: 4px 0 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.45;
        }

        .search-box {
          width: 100%;
          max-width: 300px;
          margin-left: auto;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border: 1px solid rgba(31, 41, 51, 0.11);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.74);
          color: #9ca3af;
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          color: #202124;
          font-size: 14px;
        }

        .category-tabs {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding: 0 0 12px;
          border-bottom: 1px solid rgba(31, 41, 51, 0.1);
        }

        .category-tabs button {
          border: 0;
          background: transparent;
          color: #6b7280;
          padding: 10px 18px;
          border-radius: 999px;
          white-space: nowrap;
          font-weight: 800;
          cursor: pointer;
        }

        .category-tabs .active {
          color: #2563eb;
          background: #ffffff;
          box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.12), 0 4px 14px rgba(17, 24, 39, 0.08);
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .template-card {
          text-align: left;
          min-height: 166px;
          padding: 20px;
          border: 1px solid rgba(31, 41, 51, 0.1);
          border-radius: 14px;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(17, 24, 39, 0.04);
        }

        .template-card span {
          color: #0f766e;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .template-card strong {
          display: block;
          margin: 12px 0 8px;
          color: #202124;
          font-size: 17px;
          line-height: 1.25;
        }

        .template-card p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        .refine-panel {
          padding: 24px;
          position: sticky;
          top: 24px;
        }

        .panel-title {
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .panel-title h2 {
          font-size: 24px;
        }

        .panel-title button,
        .output-header button {
          padding: 11px 15px;
          border-radius: 12px;
          background: #111827;
          color: #ffffff;
          white-space: nowrap;
        }

        .question-list {
          display: grid;
          gap: 10px;
          margin-bottom: 14px;
        }

        .question-item {
          padding: 13px 14px;
          border: 1px solid rgba(37, 99, 235, 0.13);
          border-radius: 12px;
          background: rgba(239, 246, 255, 0.82);
          color: #1f2937;
          font-size: 14px;
          line-height: 1.45;
        }

        .answer-box {
          width: 100%;
          resize: vertical;
          outline: none;
          border: 1px solid rgba(31, 41, 51, 0.11);
          border-radius: 12px;
          padding: 13px 14px;
          color: #202124;
          background: rgba(255, 255, 255, 0.86);
          font: 500 14px/1.5 DM Sans, sans-serif;
          margin-bottom: 16px;
        }

        .output-card {
          overflow: hidden;
          border: 1px solid rgba(31, 41, 51, 0.1);
          border-radius: 16px;
          background: #ffffff;
        }

        .output-header {
          padding: 16px;
          border-bottom: 1px solid rgba(31, 41, 51, 0.08);
        }

        .output-header span {
          color: #6b7280;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .output-header h3 {
          font-size: 18px;
          margin-top: 2px;
        }

        .output-card pre {
          min-height: 270px;
          max-height: 560px;
          overflow: auto;
          margin: 0;
          padding: 18px;
          white-space: pre-wrap;
          color: #263238;
          background: #fbfbfa;
          font: 500 13px/1.65 DM Mono, ui-monospace, monospace;
        }

        .insight-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 14px;
        }

        .insight-row div {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.74);
          color: #5f6368;
          font-size: 13px;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 980px) {
          .master-prompt-page {
            padding: 24px 18px 42px;
          }

          h1 {
            font-size: 34px;
          }

          .workspace-grid {
            grid-template-columns: 1fr;
          }

          .refine-panel {
            position: static;
          }

          .composer-bar,
          .panel-title {
            flex-wrap: wrap;
          }

          .field-row:nth-child(2) {
            margin-left: 0;
          }

          .mode-pills {
            width: 100%;
            justify-content: center;
            overflow-x: auto;
          }
        }

        @media (max-width: 640px) {
          .composer-bar {
            align-items: stretch;
            flex-direction: column;
          }

          .icon-button,
          .panel-title button,
          .output-header button {
            width: 100%;
          }

          .panel-heading,
          .output-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .search-box {
            max-width: none;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}
