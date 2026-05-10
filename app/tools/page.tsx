'use client'
import { useState } from 'react'
import { TOOLS_DB, CATEGORIES } from '@/lib/utils'
import { Search, ExternalLink, ArrowLeft, Star, Eye, X, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function ToolsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<any>(null)

  const filtered = TOOLS_DB.filter(t => {
    const matchQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    const matchCat = category === 'All' || t.category === category
    return matchQuery && matchCat
  })

  const sections = category === 'All' 
    ? ['Featured', 'LLMs', 'Image Generation', 'Coding Assistants', 'Automation & Agents'] 
    : [category]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top Nav */}
      <nav style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-overlay)', backdropFilter: 'var(--glass-blur)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Home
          </Link>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px', color: 'var(--text-heading)' }}>
            Torus<span style={{ color: 'var(--accent-teal)' }}>AI</span> Hub
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input 
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search AI tools..." 
              style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 12px 10px 40px', color: 'var(--text)', fontSize: '14px', width: '320px', outline: 'none' }}
            />
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div style={{ display: 'flex', gap: '0' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', padding: '32px 16px', height: 'calc(100vh - 72px)', position: 'sticky', top: '72px', background: 'var(--surface-overlay)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingLeft: '12px', fontFamily: 'DM Mono, monospace' }}>Categories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '10px 14px', borderRadius: '10px', border: 'none',
                  background: category === cat ? 'rgba(66,127,131,0.1)' : 'transparent',
                  color: category === cat ? 'var(--accent-teal)' : 'var(--text-muted)',
                  fontSize: '14px', fontWeight: category === cat ? 700 : 500,
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '48px' }}>
          {sections.map(sec => {
            const items = filtered.filter(t => category !== 'All' || t.category === sec || (sec === 'Featured' && t.featured))
            if (!items.length) return null
            
            return (
              <section key={sec} style={{ marginBottom: '64px' }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-heading)' }}>{sec}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {items.map(tool => (
                    <div 
                      key={tool.name}
                      onClick={() => setSelected(tool)}
                      style={{ 
                        background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '16px', 
                        padding: '24px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden'
                      }}
                      className="tool-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                          {tool.emoji || '🛠️'}
                        </div>
                        {tool.featured && <Star size={14} fill="var(--accent-orange)" color="var(--accent-orange)" />}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)' }}>{tool.name}</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{tool.description}</p>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {tool.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ fontSize: '10px', background: 'var(--bg-2)', color: 'var(--text-subtle)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </main>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setSelected(null)}>
          <div 
            style={{ width: '100%', maxWidth: '600px', background: 'var(--bg)', border: '1px solid var(--border-subtle)', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', position: 'relative' }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '32px', marginTop: '-60px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'var(--bg)', border: '4px solid var(--bg)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                {selected.icon || '🛠️'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>{selected.name}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                   {selected.tags.map((t: string) => <span key={t} style={{ fontSize: '10px', background: 'var(--bg-2)', color: 'var(--text-subtle)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>{t}</span>)}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>{selected.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '16px', background: 'var(--bg-2)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Category</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{selected.category}</div>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-2)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Pricing</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{selected.price || 'Free / Freemium'}</div>
                </div>
              </div>

              <a 
                href={selected.url} target="_blank" rel="noreferrer"
                style={{ width: '100%', padding: '16px', background: 'var(--text-heading)', color: 'var(--bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '16px', fontFamily: 'Syne, sans-serif', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Open {selected.name} <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tool-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-teal);
          box-shadow: 0 12px 32px rgba(66,127,131,0.12);
        }
      `}</style>
    </div>
  )
}
