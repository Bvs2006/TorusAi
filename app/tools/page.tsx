'use client'
// app/(app)/tools/page.tsx
import { useState } from 'react'
import { TOOLS_DB } from '@/lib/utils'
import { Search, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['All', 'AI Coding', 'Database', 'Backend', 'Deployment', 'Design', 'Automation', 'AI Service']

export default function ToolsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<'score' | 'alpha' | 'free'>('score')
  const [selected, setSelected] = useState<typeof TOOLS_DB[0] | null>(null)

  const filtered = TOOLS_DB
    .filter(t => {
      const matchQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      const matchCat = category === 'All' || t.category === category
      return matchQuery && matchCat
    })
    .sort((a, b) => {
      if (sort === 'score') return b.score - a.score
      if (sort === 'alpha') return a.name.localeCompare(b.name)
      if (sort === 'free') {
        const freeA = a.pricing === 'Free' ? 0 : a.pricing === 'Freemium' ? 1 : 2
        const freeB = b.pricing === 'Free' ? 0 : b.pricing === 'Freemium' ? 1 : 2
        return freeA - freeB
      }
      return 0
    })

  const pricingColor = (pricing: string) => ({
    Free: { bg: 'rgba(16,185,129,.1)', border: 'rgba(16,185,129,.3)', color: '#10b981' },
    Freemium: { bg: 'rgba(66,127,131,.1)', border: 'rgba(66,127,131,.3)', color: '#5aa0a4' },
    Paid: { bg: 'rgba(244,63,94,.1)', border: 'rgba(244,63,94,.3)', color: '#f43f5e' },
  }[pricing] || { bg: 'rgba(38,69,72,.1)', border: 'rgba(38,69,72,.14)', color: '#607276' })

  return (
    <div style={{ minHeight: '100vh', background: '#eef3f4', color: '#172326', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'rgba(246,249,249,.72)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(38,69,72,.08)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#607276', fontSize: '13px', transition: 'color .15s' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '19px', letterSpacing: '-0.5px' }}>
          Torus<span style={{ color: '#5aa0a4' }}>AI</span> Tool Hub
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/login" style={{ padding: '6px 16px', border: '1px solid rgba(38,69,72,.12)', borderRadius: '8px', color: '#607276', textDecoration: 'none', fontSize: '13px' }}>
            Login
          </Link>
          <Link href="/signup" style={{ padding: '7px 18px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
          ⚡ Tool Hub
        </h1>
        <p style={{ color: '#607276', fontSize: '13px' }}>
          {TOOLS_DB.length} tools ranked by Torus Score — based on free tier, DX, and AI compatibility.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a9a9d' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search tools..."
            style={{
              width: '100%', background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)',
              borderRadius: '10px', padding: '9px 14px 9px 34px', color: '#172326', fontSize: '13px',
              outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s'
            }}
            onFocus={e => (e.target.style.borderColor = '#427f83')}
            onBlur={e => (e.target.style.borderColor = 'rgba(38,69,72,.12)')}
          />
        </div>
        {/* Sort */}
        <select value={sort} onChange={e => setSort(e.target.value as any)} style={{
          background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '10px',
          padding: '9px 14px', color: '#607276', fontSize: '13px', outline: 'none',
          fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
        }}>
          <option value="score">Sort: Torus Score</option>
          <option value="alpha">Sort: A–Z</option>
          <option value="free">Sort: Free first</option>
        </select>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', transition: 'all 0.15s',
            background: category === cat ? 'rgba(66,127,131,.2)' : 'transparent',
            border: `1px solid ${category === cat ? '#427f83' : 'rgba(38,69,72,.12)'}`,
            color: category === cat ? '#83b9bd' : '#607276'
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '16px' }}>
        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selected ? 2 : 3}, 1fr)`, gap: '12px' }}>
          {filtered.map(tool => {
            const pc = pricingColor(tool.pricing)
            return (
              <div key={tool.name}
                onClick={() => setSelected(selected?.name === tool.name ? null : tool)}
                style={{
                  background: selected?.name === tool.name ? 'rgba(66,127,131,.1)' : 'rgba(255,255,255,.62)',
                  border: `1px solid ${selected?.name === tool.name ? '#427f83' : 'rgba(38,69,72,.12)'}`,
                  borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.15s'
                }}
                onMouseOver={e => { if (selected?.name !== tool.name) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(66,127,131,.3)' }}
                onMouseOut={e => { if (selected?.name !== tool.name) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(38,69,72,.12)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{tool.emoji}</span>
                    <div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700 }}>{tool.name}</div>
                      <div style={{ fontSize: '10px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>{tool.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, color: '#5aa0a4' }}>
                      {tool.score}
                    </div>
                    <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>score</div>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#607276', lineHeight: '1.5', marginBottom: '10px' }}>
                  {tool.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontFamily: 'DM Mono, monospace', background: pc.bg, border: `1px solid ${pc.border}`, color: pc.color }}>
                    {tool.pricing}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{ width: '14px', height: '4px', borderRadius: '2px', background: i < Math.round(tool.score / 2) ? '#427f83' : 'rgba(43,69,72,.12)' }} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '14px', padding: '22px', height: 'fit-content', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '36px' }}>{selected.emoji}</span>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800 }}>{selected.name}</div>
                <div style={{ fontSize: '12px', color: '#607276' }}>{selected.category}</div>
              </div>
            </div>
            <p style={{ color: '#607276', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>
              {selected.description}
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {selected.tags.map(tag => (
                <span key={tag} style={{ padding: '3px 10px', background: 'rgba(43,69,72,.12)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '20px', fontSize: '11px', color: '#607276', fontFamily: 'DM Mono, monospace' }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,.54)', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#607276' }}>Torus Score</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, color: '#5aa0a4' }}>{selected.score}/10</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(43,69,72,.12)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${selected.score * 10}%`, background: 'linear-gradient(90deg, #427f83, #06b6d4)', borderRadius: '3px' }} />
              </div>
            </div>
            <a href={selected.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '10px',
              color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif',
              fontSize: '13px', fontWeight: 700, transition: 'all 0.2s'
            }}>
              <ExternalLink size={14} /> Open {selected.name}
            </a>
            <button onClick={() => setSelected(null)} style={{
              width: '100%', marginTop: '8px', padding: '8px', background: 'transparent',
              border: '1px solid rgba(38,69,72,.12)', borderRadius: '8px',
              color: '#607276', fontSize: '12px', cursor: 'pointer'
            }}>
              Close
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
