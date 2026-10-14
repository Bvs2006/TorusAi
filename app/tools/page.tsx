'use client'
import { useState, useMemo } from 'react'
import { TOOLS_DB, CATEGORIES } from '@/lib/utils'
import {
  Search,
  ExternalLink,
  ArrowLeft,
  Star,
  X,
  Sparkles,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Tag,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function ToolsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Freemium' | 'Paid'>('All')
  const [selected, setSelected] = useState<any>(null)

  const filtered = useMemo(() => {
    return TOOLS_DB.filter(t => {
      const matchQuery = !query.trim() ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

      const matchCat = category === 'All' || t.category === category

      const matchPricing = pricingFilter === 'All' ||
        (pricingFilter === 'Free' && (t.pricing.toLowerCase().includes('free') && !t.pricing.toLowerCase().includes('freemium'))) ||
        (pricingFilter === 'Freemium' && t.pricing.toLowerCase().includes('freemium')) ||
        (pricingFilter === 'Paid' && t.pricing.toLowerCase().includes('paid'))

      return matchQuery && matchCat && matchPricing
    })
  }, [query, category, pricingFilter])

  // Get count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: TOOLS_DB.length }
    CATEGORIES.forEach(cat => {
      if (cat === 'All') return
      counts[cat] = TOOLS_DB.filter(t => t.category === cat).length
    })
    return counts
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#08080c] text-neutral-900 dark:text-white/90 selection:bg-purple-500/30 selection:text-white antialiased font-sans flex flex-col transition-colors duration-300">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#08080c]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors bg-neutral-100 hover:bg-neutral-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/10"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white group">
              <span className="font-serif tracking-normal text-[24px]">Torus</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10">
                Directory
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/planner"
              className="hidden sm:inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-neutral-950 hover:bg-neutral-800 dark:text-black dark:bg-white dark:hover:bg-neutral-200 px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
            >
              <Sparkles size={14} /> Plan Project
            </Link>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-neutral-200/80 dark:border-white/[0.08] dark-grid-pattern pt-16 pb-14 px-6 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[240px] bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-600/20 dark:via-indigo-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/20 dark:border-white/10 bg-purple-50 dark:bg-white/[0.04] backdrop-blur-md mb-6 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest">
            <Compass size={13} className="text-purple-600 dark:text-purple-400" />
            <span>Curated AI Developer Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 dark:text-white tracking-tight mb-4 leading-tight max-w-3xl mx-auto">
            The AI Tools Directory <br />
            <span className="italic font-light text-neutral-700 dark:text-white/80">benchmarked for builders.</span>
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Explore 30+ cutting-edge models, coding agents, multimodal engines, and developer tools—ranked by the Torus Intelligence Score.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center bg-white dark:bg-[#11121b] border border-neutral-200 dark:border-white/15 focus-within:border-purple-500/60 rounded-full p-2 pl-5 shadow-sm dark:shadow-2xl transition-all">
              <Search size={18} className="text-neutral-400 shrink-0 mr-3" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by tool name, model, tag (e.g., 'Groq', 'IDE', 'Speech')..."
                className="w-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white mr-2"
                >
                  <X size={15} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                ⌘K
              </div>
            </div>
          </div>

          {/* Micro Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {TOOLS_DB.length} Verified Tools
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Star size={12} className="text-purple-500 dark:text-purple-400 fill-purple-500 dark:fill-purple-400" /> Torus Benchmarked
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-cyan-600 dark:text-cyan-400" /> Zero Overhead Architecture
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CATEGORY PILLS & PRICING FILTERS
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-white/90 dark:bg-[#08080c]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-white/[0.08] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Horizontal Scrollable Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map(cat => {
              const active = category === cat
              const count = categoryCounts[cat] || 0
              if (cat !== 'All' && count === 0) return null
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-medium px-3.5 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-white/[0.04] text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white border border-neutral-200/80 dark:border-white/10'
                  }`}
                >
                  {cat}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active
                      ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black'
                      : 'bg-neutral-200/80 text-neutral-600 dark:bg-white/10 dark:text-neutral-400'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Pricing Quick Filters */}
          <div className="flex items-center gap-1.5 shrink-0 bg-neutral-100 dark:bg-white/[0.04] p-1 rounded-full border border-neutral-200/80 dark:border-white/10 text-xs">
            {(['All', 'Free', 'Freemium', 'Paid'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPricingFilter(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  pricingFilter === p
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN GRID OF TOOLS
          ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-serif text-neutral-900 dark:text-white mb-2">No matching tools found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 max-w-sm mx-auto">
              We couldn&apos;t find any AI tools matching &quot;{query}&quot;. Try broadening your keywords or resetting filters.
            </p>
            <button
              onClick={() => { setQuery(''); setCategory('All'); setPricingFilter('All') }}
              className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(tool => (
              <div
                key={tool.name}
                onClick={() => setSelected(tool)}
                className="group relative bg-white dark:bg-[#0c0d15] hover:bg-neutral-50 dark:hover:bg-[#11121d] border border-neutral-200/80 dark:border-white/[0.08] hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Category + Score */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-white/[0.06] border border-neutral-200/80 dark:border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {tool.emoji || '🛠️'}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center gap-1 font-semibold">
                        <Star size={10} className="fill-purple-600 dark:fill-purple-400 stroke-none" />
                        {tool.score}
                      </span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors flex items-center justify-between">
                      <span>{tool.name}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 dark:text-purple-400" />
                    </h3>
                    <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                    {tool.description}
                  </p>
                </div>

                {/* Footer: Tags & Pricing */}
                <div className="pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded border border-neutral-200/80 dark:border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className={`text-[11px] font-mono font-medium ${
                    tool.pricing.toLowerCase().includes('free') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          5. TOOL DETAIL MODAL
          ───────────────────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white dark:bg-[#0e101a] border border-neutral-200 dark:border-white/15 rounded-3xl p-8 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient Modal Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 dark:bg-purple-600/20 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/[0.06] dark:hover:bg-white/15 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 flex items-center justify-center text-4xl shadow-inner">
                {selected.emoji || '🛠️'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-serif font-normal text-neutral-900 dark:text-white">{selected.name}</h2>
                  <span className="text-xs font-mono bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    <Star size={11} className="fill-purple-600 dark:fill-purple-400 stroke-none" /> {selected.score} Score
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{selected.category}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 bg-neutral-50 dark:bg-white/[0.03] p-4 rounded-xl border border-neutral-200/80 dark:border-white/5">
              {selected.description}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-neutral-50 dark:bg-white/[0.03] p-3.5 rounded-xl border border-neutral-200/80 dark:border-white/5">
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">Pricing Model</span>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">{selected.pricing}</span>
              </div>
              <div className="bg-neutral-50 dark:bg-white/[0.03] p-3.5 rounded-xl border border-neutral-200/80 dark:border-white/5">
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">Primary Domain</span>
                <span className="text-xs font-mono text-purple-600 dark:text-purple-300 font-semibold">{selected.domain || 'Official Site'}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Capabilities & Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs font-mono bg-neutral-100 dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-200/80 dark:border-white/10"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-6 py-3.5 rounded-xl transition-all shadow-md"
              >
                Launch {selected.name} <ExternalLink size={15} />
              </a>
              <Link
                href={`/planner?tool=${encodeURIComponent(selected.name)}`}
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-neutral-800 dark:text-white/90 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border border-neutral-200 dark:border-white/15 px-5 py-3.5 rounded-xl transition-colors"
              >
                Plan with Tool
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#07070b] py-8 px-6 text-neutral-500 text-xs font-mono mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Team Torus · Intelligent AI Tool Directory.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
            <Link href="/planner" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Planner</Link>
            <Link href="/mcp" className="hover:text-neutral-900 dark:hover:text-white transition-colors">MCP Protocol</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
