import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Play,
  Terminal,
  Layers,
  Cpu,
  Search,
  Zap,
  ExternalLink,
  Code2,
  Users,
  Bot,
  MessageSquare,
  ChevronRight,
  Star,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Globe,
  Boxes,
  Compass
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

// Soundwave bar heights array for visual frequency horizon
const WAVE_BARS = [
  18, 28, 42, 65, 82, 45, 92, 110, 78, 55, 95, 115, 88, 62, 102, 120, 
  85, 98, 118, 90, 72, 105, 125, 95, 68, 108, 118, 85, 60, 92, 112, 
  80, 52, 88, 105, 75, 48, 82, 98, 70, 42, 75, 90, 62, 38, 68, 82, 
  55, 32, 58, 72, 48, 25, 45, 62, 38, 22, 35, 48, 30, 18, 28, 40, 22
]

export default async function LandingPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-obsidian text-white/90 selection:bg-purple-500/30 selection:text-white antialiased font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08080c]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#08080c] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
              </div>
            </div>
            <span className="font-serif tracking-normal text-[26px]">Torus</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10">
              AI
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] text-white/60 font-medium">
            <Link href="#solutions" className="hover:text-white transition-colors">Products</Link>
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#mcp" className="hover:text-white transition-colors">Developers</Link>
            <Link href="/tools" className="hover:text-white transition-colors">Tool Hub</Link>
            <Link href="#team" className="hover:text-white transition-colors">Company</Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-[14px] font-medium text-white/70 hover:text-white px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center text-[13px] font-semibold text-black bg-white hover:bg-neutral-200 px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-white/20 hover:scale-[1.02]"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        
        {/* ─────────────────────────────────────────────────────────────
            2. HERO SECTION: "Create reliable AI assistants for daily challenges"
            ───────────────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 text-center px-6">
          {/* Ambient Glow Horizon at Top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-purple-600/20 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />

          {/* Micro Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-8 text-[12px] font-mono text-purple-300">
            <Sparkles size={13} className="text-purple-400" />
            <span>Search-Grounded Architecture & Prompt Engine</span>
          </div>

          {/* Main Headline - Editorial Serif */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-serif font-normal tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
            Create reliable AI architectures <br />
            <span className="italic font-light text-white/90">for complex challenges</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Torus grounds LLMs with real-time web search to generate optimal tech stacks, visual system blueprints, and step-by-step IDE prompts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-black bg-white hover:bg-neutral-100 px-7 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-white/20 hover:scale-[1.02]"
            >
              Try Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-2 text-[14px] font-medium text-white/90 bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-md"
            >
              <Compass size={16} className="text-purple-400" />
              Explore Tool Hub
            </Link>
          </div>

          {/* Visual Showcase: Avatar Silhouette + Floating UI Cards */}
          <div className="relative max-w-4xl mx-auto mt-6 pt-10">
            {/* Ambient Backlight for Central Silhouette */}
            <div className="absolute inset-x-0 bottom-12 h-64 bg-gradient-to-t from-purple-900/30 via-indigo-900/20 to-transparent blur-3xl pointer-events-none" />

            {/* Silhouette Figure Illustration */}
            <div className="relative mx-auto w-56 h-56 md:w-72 md:h-72 flex items-end justify-center pointer-events-none select-none">
              <svg viewBox="0 0 200 200" className="w-full h-full fill-neutral-900 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                <path d="M100 20 C85 20, 72 32, 72 48 C72 60, 78 70, 88 74 C60 84, 40 112, 40 148 L160 148 C160 112, 140 84, 112 74 C122 70, 128 60, 128 48 C128 32, 115 20, 100 20 Z" />
              </svg>
            </div>

            {/* Floating Left Card: "Create Project" */}
            <div className="absolute top-6 left-2 sm:left-10 md:left-4 z-20 animate-float">
              <div className="bg-[#12131c]/90 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-left max-w-[240px]">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <span className="text-[13px] font-semibold text-white">Create Project</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[11px] font-mono bg-white/[0.08] text-white/80 px-2.5 py-1 rounded-md border border-white/10">
                    Llama 3.3 70B
                  </div>
                  <button className="text-[11px] font-semibold bg-purple-600 text-white px-2.5 py-1 rounded-md hover:bg-purple-500">
                    Deploy
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Right Card: Chat/Prompt Bubble */}
            <div className="absolute top-16 right-2 sm:right-10 md:right-4 z-20 animate-float-reverse">
              <div className="bg-[#12131c]/90 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-left max-w-[280px]">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[10px] text-purple-300 font-mono">
                    AI
                  </div>
                  <span className="text-[12px] font-mono text-neutral-400">Step 3 / 7 Prompts</span>
                </div>
                <p className="text-[12px] text-white/90 font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                  &quot;Generate PostgreSQL schema & session authentication context...&quot;
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 size={12} /> Ready for Cursor
                  </span>
                  <span className="text-[10px] font-mono">420ms</span>
                </div>
              </div>
            </div>

            {/* Glowing Soundwave / Frequency Horizon across the bottom of Hero */}
            <div className="soundwave-horizon mt-4">
              {WAVE_BARS.map((height, idx) => (
                <div
                  key={idx}
                  className="soundwave-bar"
                  style={{
                    height: `${height}px`,
                    animationDelay: `${(idx % 12) * 0.15}s`,
                    opacity: 0.3 + (height / 125) * 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. SECTION 2: "An AI solution tailored to your engineering needs."
               Dark Grid with Neon Geometric Wireframe Glyphs
            ───────────────────────────────────────────────────────────── */}
        <section id="solutions" className="py-24 px-6 relative border-t border-white/[0.06] dark-grid-pattern">
          <div className="max-w-7xl mx-auto">
            
            {/* Header with crosshair tag */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight mb-4 leading-tight">
                  An AI solution tailored <br />
                  <span className="italic font-light text-white/80">to your engineering needs.</span>
                </h2>
                <p className="text-neutral-400 text-base md:text-lg max-w-xl">
                  Use Torus to automate key architectural, tech stack, and development workflows for your teams.
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span className="font-mono text-[12px] text-neutral-500 tracking-widest uppercase">
                  + The Torus Platform +
                </span>
                <Link
                  href="/mcp"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-white/90 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full border border-white/10 transition-colors"
                >
                  <Play size={12} className="fill-white" /> Have 2 mins? Watch Demo
                </Link>
              </div>
            </div>

            {/* 3 Wireframe Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Stack Grounding */}
              <div className="wireframe-box bg-[#0c0d14] border border-white/[0.08] rounded-2xl p-8 relative overflow-hidden group">
                <div className="w-16 h-16 mb-8 flex items-center justify-center">
                  {/* Geometric Octagram SVG in Pink/Purple */}
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-purple-400 fill-none stroke-[1.5] transition-transform duration-500 group-hover:rotate-45">
                    <polygon points="50,5 95,50 50,95 5,50" />
                    <polygon points="50,5 95,50 50,95 5,50" transform="rotate(45 50 50)" />
                    <circle cx="50" cy="50" r="18" className="stroke-purple-300" />
                    <circle cx="50" cy="50" r="4" className="fill-purple-400 stroke-none" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Live Stack Grounding</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Evaluate 5 parallel search vectors to pair modern frameworks with zero-cost free tiers and active libraries.
                </p>
              </div>

              {/* Card 2: Visual Architecture */}
              <div className="wireframe-box bg-[#0c0d14] border border-white/[0.08] rounded-2xl p-8 relative overflow-hidden group">
                <div className="w-16 h-16 mb-8 flex items-center justify-center">
                  {/* Geometric Target / Diamond SVG in Cyan */}
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-cyan-400 fill-none stroke-[1.5] transition-transform duration-500 group-hover:scale-105">
                    <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
                    <circle cx="50" cy="50" r="38" className="stroke-cyan-500/60" />
                    <line x1="10" y1="50" x2="90" y2="50" className="stroke-cyan-400/40" />
                    <line x1="50" y1="10" x2="50" y2="90" className="stroke-cyan-400/40" />
                    <circle cx="50" cy="50" r="4" className="fill-cyan-400 stroke-none" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Visual Architecture</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Turn raw concepts into interactive ReactFlow node graphs, service boundaries, and data pipelines.
                </p>
              </div>

              {/* Card 3: Execution Velocity */}
              <div className="wireframe-box bg-[#0c0d14] border border-white/[0.08] rounded-2xl p-8 relative overflow-hidden group">
                <div className="w-16 h-16 mb-8 flex items-center justify-center">
                  {/* Geometric Matrix Cube SVG in Emerald */}
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-emerald-400 fill-none stroke-[1.5] transition-transform duration-500 group-hover:rotate-12">
                    <rect x="22" y="22" width="56" height="56" />
                    <line x1="22" y1="22" x2="78" y2="78" />
                    <line x1="78" y1="22" x2="22" y2="78" />
                    <rect x="36" y="36" width="28" height="28" className="stroke-emerald-300" />
                    <circle cx="50" cy="50" r="4" className="fill-emerald-400 stroke-none" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">7-Phase Build Prompts</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Generate verified, phase-by-phase execution prompts formatted specifically for Cursor, Windsurf, & Bolt.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. SECTION 3: HIGH-CONTRAST LIGHT CONTAINER
               "Voice integration, interactive replies, and multi-channel support."
            ───────────────────────────────────────────────────────────── */}
        <section id="features" className="px-4 sm:px-6 py-6">
          <div className="max-w-7xl mx-auto bg-[#fafafc] text-neutral-900 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Heading + Tag + Button */}
              <div className="lg:col-span-5">
                <span className="font-mono text-[12px] text-neutral-500 uppercase tracking-widest block mb-4">
                  [ Torus Features ]
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif font-normal text-neutral-950 tracking-tight leading-[1.12] mb-6">
                  Search-grounded plans, interactive node graphs, and multi-IDE support.
                </h2>
                <p className="text-neutral-600 text-base leading-relaxed mb-8">
                  Bridge the gap from abstract idea to production deployment with synchronized tools designed for modern developer velocity.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-neutral-950 hover:bg-neutral-800 px-6 py-3 rounded-full transition-all duration-200"
                >
                  Explore All <ArrowRight size={15} />
                </Link>
              </div>

              {/* Right Column: Numbered Cards with Dot Matrix & Waveform Graphics */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Numbered Card 1: [1/10] */}
                <div className="bg-white rounded-3xl p-7 border border-neutral-200/80 shadow-sm flex flex-col justify-between h-[360px] overflow-hidden relative group hover:border-neutral-400 transition-colors">
                  <div>
                    <span className="font-mono text-[13px] font-bold text-neutral-400 block mb-3">
                      [1/10]
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      Conversational Planning
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Deploy on web, IDE, and terminal with engaging real-time search context that grounds tech selections.
                    </p>
                  </div>

                  {/* Dot Matrix Visual at Base */}
                  <div className="w-full h-28 light-dot-pattern rounded-2xl bg-neutral-50 border border-neutral-100 p-3 flex items-end justify-center gap-1 overflow-hidden">
                    {[12, 24, 38, 52, 34, 48, 64, 40, 26, 45, 60, 32, 20, 35, 50, 28, 16].map((h, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-sm opacity-75"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Numbered Card 2: [2/11] */}
                <div className="bg-white rounded-3xl p-7 border border-neutral-200/80 shadow-sm flex flex-col justify-between h-[360px] overflow-hidden relative group hover:border-neutral-400 transition-colors">
                  <div>
                    <span className="font-mono text-[13px] font-bold text-neutral-400 block mb-3">
                      [2/11]
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      IDE Model Context (MCP)
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Enable advanced planning tools inside Cursor, VS Code, and Claude Desktop with zero-context switching.
                    </p>
                  </div>

                  {/* Frequency Wave Visual at Base */}
                  <div className="w-full h-28 rounded-2xl bg-neutral-50 border border-neutral-100 p-3 flex items-end justify-center gap-1 overflow-hidden">
                    {[16, 32, 54, 70, 48, 65, 82, 55, 36, 62, 78, 44, 25, 48, 68, 38, 20].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-purple-500 via-pink-500 to-cyan-400 rounded-full"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. SECTION 4: DARK METRICS & PARTNERS
               "Talkie build high trust agents drives results"
            ───────────────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-12">
          <div className="max-w-7xl mx-auto bg-[#0a0b10] border border-white/[0.08] rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-16">
            
            {/* Top Row: Tag & Serif Headline */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
              <span className="font-mono text-[12px] text-neutral-400 uppercase tracking-widest">
                [ Proven Impact ]
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white max-w-2xl text-left md:text-right leading-tight">
                Torus builds high trust architectures that drive results
              </h2>
            </div>

            {/* 3 Pastel-Tinted Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              
              {/* Card 1: Slate-Blue Tint */}
              <div className="rounded-3xl p-8 bg-[#151c28] border border-[#223044] flex flex-col justify-between min-h-[200px]">
                <div className="text-5xl sm:text-6xl font-sans font-bold text-[#7ca9f4] tracking-tight">
                  75<span className="text-4xl font-normal">%</span>
                </div>
                <p className="text-sm font-medium text-neutral-300 mt-6 leading-snug">
                  Lowering overall scaffolding and architectural planning overhead
                </p>
              </div>

              {/* Card 2: Sage-Green Tint */}
              <div className="rounded-3xl p-8 bg-[#162720] border border-[#224032] flex flex-col justify-between min-h-[200px]">
                <div className="text-5xl sm:text-6xl font-sans font-bold text-[#6ee7b7] tracking-tight">
                  3.2<span className="text-3xl font-light">s</span>
                </div>
                <p className="text-sm font-medium text-neutral-300 mt-6 leading-snug">
                  Average generation time from raw idea to full 7-phase build roadmap
                </p>
              </div>

              {/* Card 3: Orchid/Purple Tint */}
              <div className="rounded-3xl p-8 bg-[#281b2c] border border-[#442c4b] flex flex-col justify-between min-h-[200px]">
                <div className="text-5xl sm:text-6xl font-sans font-bold text-[#e879f9] tracking-tight">
                  4.9<span className="text-3xl">★</span>
                </div>
                <p className="text-sm font-medium text-neutral-300 mt-6 leading-snug">
                  Developer satisfaction score across 1,400+ generated project blueprints
                </p>
              </div>

            </div>

            {/* Monochrome Partner Logos Bar */}
            <div className="border-t border-white/[0.08] pt-10 flex flex-wrap items-center justify-between gap-8 opacity-60">
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">GROQ</span>
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">VERCEL</span>
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">FIREBASE</span>
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">SEARXNG</span>
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">CURSOR</span>
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">GITHUB</span>
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">DOCKER</span>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. SECTION 5: LIGHT SECTION — ISOMETRIC FOLDER STACK INTEGRATION
               "All your tools, One seamless workflow"
            ───────────────────────────────────────────────────────────── */}
        <section id="mcp" className="px-4 sm:px-6 py-6">
          <div className="max-w-7xl mx-auto bg-[#fafafc] text-neutral-900 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Heading & Subtitle */}
              <div className="lg:col-span-5">
                <span className="font-mono text-[12px] text-neutral-500 uppercase tracking-widest block mb-4">
                  [ Integrations // 05 ]
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif font-normal text-neutral-950 tracking-tight leading-[1.12] mb-6">
                  All your tools, <br />
                  <span className="italic font-light">One seamless workflow</span>
                </h2>
                <p className="text-neutral-600 text-base leading-relaxed mb-8">
                  Implement Torus throughout your engineering stack to streamline development, eliminate architectural debt, and keep your entire team in sync.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/mcp"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-neutral-950 hover:bg-neutral-800 px-6 py-3 rounded-full transition-all"
                  >
                    View MCP Setup <ExternalLink size={14} />
                  </Link>
                  <a
                    href="https://github.com/Bvs2006/TorusAi.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-800 bg-neutral-200/80 hover:bg-neutral-300 px-5 py-3 rounded-full transition-all"
                  >
                    GitHub Repository
                  </a>
                </div>
              </div>

              {/* Right Column: Layered Folder Tab Graphic */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="relative w-full max-w-[480px] h-[340px] folder-stack">
                  
                  {/* Folder Tab 3 (Back) */}
                  <div className="folder-card absolute top-0 left-12 right-0 bg-neutral-200 rounded-3xl p-5 border border-neutral-300 shadow-md">
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
                      <Terminal size={14} /> GitHub Actions & Docker CI
                    </div>
                  </div>

                  {/* Folder Tab 2 (Middle) */}
                  <div className="folder-card absolute top-8 left-6 right-6 bg-neutral-100 rounded-3xl p-5 border border-neutral-200 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-700">
                      <Boxes size={14} /> Firebase & SearXNG Engine
                    </div>
                  </div>

                  {/* Folder Tab 1 (Front Active Card) */}
                  <div className="folder-card absolute top-16 left-0 right-12 bg-white rounded-3xl p-7 border border-neutral-200 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                          <Bot size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">Cursor / Claude IDE</h4>
                          <p className="text-[11px] text-neutral-500 font-mono">Model Context Protocol Connected</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Live Sync
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-neutral-600 font-mono bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span>• torus_build_idea</span>
                        <span className="text-purple-600 font-semibold">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• stack_grounding_searxng</span>
                        <span className="text-neutral-400">Ready</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• phase_prompt_generator</span>
                        <span className="text-neutral-400">Ready</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            7. SECTION 6: TEAM / ARCHITECTS
               "Built by Developers. The Visionaries."
            ───────────────────────────────────────────────────────────── */}
        <section id="team" className="py-24 px-6 border-t border-white/[0.06] bg-[#08080c]">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-[12px] text-purple-400 uppercase tracking-widest block mb-3">
                [ Team Torus // Engineering ]
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight mb-4">
                Built by Developers.
              </h2>
              <p className="text-neutral-400 text-base">
                Meet the architects and engineers who developed the Torus AI platform to empower the next generation of software builders.
              </p>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'APPARI MOHAN VENKATA NIKHIL', role: 'Team Leader', branch: 'AIML', roll: '24B11AI016', short: 'NIKHIL', college: 'AUS', linkedin: 'https://www.linkedin.com/in/nikhil-appari-365810309/', leader: true },
                { name: 'BELLAMKONDA VENKATA SRUJITH', role: 'Member', branch: 'AIML', roll: '24B11AI033', short: 'SRUJITH', college: 'AUS', linkedin: 'https://www.linkedin.com/in/venkata-srujith-bellamkonda-b78626336/' },
                { name: 'KOLAPARTHI RAVITEJA', role: 'Member', branch: 'AIML', roll: '24B11AI187', short: 'RAVI', college: 'AUS', linkedin: 'https://www.linkedin.com/in/raviteja-kolaparthi-a061b6333/' },
                { name: 'PADALA SATYANARAYANA REDDY', role: 'Member', branch: 'AIML', roll: '24B11AI311', short: 'SATYA', college: 'AUS', linkedin: 'https://www.linkedin.com/in/satya-narayana-reddy-padala-091503335/' },
                { name: 'YALAMANCHILI AKHIL', role: 'Member', branch: 'AIML', roll: '24B11AI461', short: 'AKHIL', college: 'AUS', linkedin: 'https://www.linkedin.com/in/yalamanchili-akhil-562ba42a9/' },
                { name: 'YALLA SAI NAIDU', role: 'Member', branch: 'AIML', roll: '24B11AI464', short: 'SAI', college: 'AUS', linkedin: 'https://www.linkedin.com/in/sai-naidu-yalla-491a42337/' },
              ].map((dev, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-6 bg-[#0e0f17] border transition-all duration-300 hover:-translate-y-1 ${
                    dev.leader ? 'border-purple-500/50 shadow-purple-500/10 shadow-lg' : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center font-serif text-lg text-white">
                      {dev.short[0]}
                    </span>
                    {dev.leader ? (
                      <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold px-2.5 py-1 rounded-full">
                        Team Leader
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase text-neutral-400">
                        {dev.role}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                    {dev.name}
                  </h3>
                  <p className="text-xs font-mono text-purple-400 mb-4">
                    {dev.branch} · {dev.roll}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs">
                    <span className="text-neutral-400 font-mono">{dev.college}</span>
                    {dev.linkedin && (
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        LinkedIn <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            8. BOTTOM CTA BANNER: "Create your next AI agent with Talkie!"
               Glowing Wave Horizon
            ───────────────────────────────────────────────────────────── */}
        <section className="relative py-24 sm:py-32 px-6 border-t border-white/[0.08] text-center overflow-hidden bg-[#060609]">
          
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-serif font-normal text-white tracking-tight mb-6">
              Create your next AI project <br />
              <span className="italic font-light text-white/90">with Torus!</span>
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Torus grounds LLMs with real-time web search for reliable full-stack architecture and rapid deployment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-black bg-white hover:bg-neutral-100 px-8 py-3.5 rounded-full transition-all duration-200 shadow-xl hover:shadow-white/20 hover:scale-[1.02]"
              >
                Try Now <ArrowRight size={16} />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center text-[14px] font-medium text-white/90 bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 px-7 py-3.5 rounded-full transition-all duration-200 backdrop-blur-md"
              >
                Explore Tool Hub
              </Link>
            </div>
          </div>

          {/* Glowing Soundwave at bottom of CTA banner */}
          <div className="soundwave-horizon mt-16 max-w-5xl mx-auto">
            {WAVE_BARS.slice(0, 50).map((height, idx) => (
              <div
                key={idx}
                className="soundwave-bar"
                style={{
                  height: `${height * 0.75}px`,
                  animationDelay: `${(idx % 10) * 0.18}s`,
                  opacity: 0.25 + (height / 125) * 0.75,
                }}
              />
            ))}
          </div>
        </section>

      </main>

      {/* ─────────────────────────────────────────────────────────────
          9. FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] bg-[#07070b] py-16 px-6 text-neutral-400 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white mb-4">
              <span className="font-serif text-[26px]">Torus</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10">
                AI
              </span>
            </Link>
            <p className="text-neutral-400 text-sm max-w-sm mb-6 leading-relaxed">
              Build anything. Ship everything. An open, search-grounded development intelligence platform running on true $0/month infrastructure.
            </p>

            {/* Newsletter Input */}
            <div className="flex items-center max-w-sm bg-white/[0.05] border border-white/10 rounded-full p-1.5 focus-within:border-purple-500/50 transition-colors">
              <input
                type="email"
                placeholder="example@gmail.com"
                className="bg-transparent px-4 text-xs text-white placeholder-neutral-500 outline-none w-full font-mono"
              />
              <button className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>

          {/* 4 Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-sans">
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider font-mono mb-4 text-[11px]">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#solutions" className="hover:text-white transition-colors">Overview</Link></li>
                <li><Link href="/mcp" className="hover:text-white transition-colors">MCP Server</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">Tool Hub</Link></li>
                <li><Link href="/planner" className="hover:text-white transition-colors">Project Planner</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider font-mono mb-4 text-[11px]">Torus For</h4>
              <ul className="space-y-3">
                <li><Link href="/signup" className="hover:text-white transition-colors">Students & Devs</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Hackathons</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Startups</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">AI Engineers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider font-mono mb-4 text-[11px]">Use Cases</h4>
              <ul className="space-y-3">
                <li><Link href="/planner" className="hover:text-white transition-colors">Stack Grounding</Link></li>
                <li><Link href="/workspace" className="hover:text-white transition-colors">Architecture Studio</Link></li>
                <li><Link href="/error-fix" className="hover:text-white transition-colors">Error Assistant</Link></li>
                <li><Link href="/badges" className="hover:text-white transition-colors">Streak Tracking</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider font-mono mb-4 text-[11px]">Resources</h4>
              <ul className="space-y-3">
                <li><a href="https://github.com/Bvs2006/TorusAi.git" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MCP Docs</a></li>
                <li><Link href="/DOCUMENTATION.md" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#team" className="hover:text-white transition-colors">Team Torus</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <p>© 2026 Team Torus. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Terms and conditions</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy policy</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
