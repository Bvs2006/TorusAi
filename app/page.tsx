import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowRight, Check, Compass, Layers3, Search, Sparkles, TerminalSquare, Zap } from 'lucide-react'

const steps = [
  { n: '01', icon: Compass, title: 'Describe', body: 'Start with the idea, platform, users, budget, and the rough edges you already know.' },
  { n: '02', icon: Search, title: 'Research', body: 'Torus AI checks current tools and services so the plan is grounded in what exists now.' },
  { n: '03', icon: Layers3, title: 'Map', body: 'Turn the stack into a visual architecture with services, data flow, and ownership.' },
  { n: '04', icon: TerminalSquare, title: 'Build', body: 'Move phase by phase with precise prompts for your coding workspace.' },
]

const features = [
  ['AI Build Planner', 'Generate stack choices, phases, prompts, and tradeoffs from a plain-language idea.'],
  ['Live Tool Search', 'Compare developer tools with fresh context instead of stale generic recommendations.'],
  ['Architecture Builder', 'Create a readable system map before the codebase gets expensive to change.'],
  ['Phase Prompts', 'Copy focused prompts for Cursor, Windsurf, Bolt.new, and other AI coding tools.'],
  ['Error Fix Assistant', 'Paste failures and get practical next steps, explanations, and a repair prompt.'],
  ['Project Blueprint', 'Generate file structure, API routes, database notes, and environment variables.'],
]

export default async function LandingPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen overflow-hidden bg-bg text-text">
      <nav className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/72 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-text no-underline">
            Torus<span className="text-violet-DEFAULT">AI</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {[
              ['#features', 'Features'],
              ['#how', 'How it works'],
              ['#pricing', 'Pricing'],
              ['/tools', 'Tool Hub'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-medium text-text-2 no-underline transition hover:text-text">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-full border border-slate-900/10 bg-white/60 px-4 py-2 text-sm font-semibold text-text-2 no-underline transition hover:text-text">
              Login
            </Link>
            <Link href="/signup" className="rounded-full bg-gradient-to-r from-teal-700 via-cyan-600 to-orange-500 px-5 py-2 text-sm font-bold text-white no-underline shadow-lg shadow-cyan-700/20">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.04fr_.96fr]">
          <div className="absolute left-[-160px] top-16 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />
          <div className="absolute right-[-120px] top-28 h-96 w-96 rounded-full bg-cyan-500/18 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-800/15 bg-white/72 px-4 py-2 font-mono text-xs uppercase tracking-wider text-teal-800 shadow-sm">
              <Sparkles size={14} /> Free AI project planning
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-text sm:text-6xl lg:text-7xl">
              Build anything.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-600 to-orange-500">
                Ship with a plan.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-2">
              Describe your project and get a current tech stack, visual architecture, build phases, and exact prompts for every step.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-700 via-cyan-600 to-orange-500 px-7 py-4 font-display text-base font-extrabold text-white no-underline shadow-xl shadow-cyan-800/20 transition hover:-translate-y-0.5">
                Start building <ArrowRight size={18} />
              </Link>
              <Link href="/tools" className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-7 py-4 text-base font-bold text-text no-underline transition hover:bg-white">
                Explore tools
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-text-3">
              {['No credit card', 'Open source', '$0/month', 'Fast planning'].map(item => (
                <span key={item} className="inline-flex items-center gap-2"><Check size={14} className="text-teal-700" /> {item}</span>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="telemetry-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-text-3">Plan preview</div>
                  <div className="mt-1 font-display text-2xl font-extrabold">SaaS launch system</div>
                </div>
                <div className="rounded-full bg-orange-500/12 px-3 py-1 font-mono text-xs font-semibold text-orange-700">Ready</div>
              </div>
              <div className="grid gap-3">
                {[
                  ['Frontend', 'Next.js, Tailwind, shadcn patterns', 'teal'],
                  ['Backend', 'API routes, Firebase auth, Supabase data', 'cyan'],
                  ['Build Phases', 'Blueprint, features, deploy, polish', 'orange'],
                ].map(([label, body, tone]) => (
                  <div key={label} className="rounded-xl border border-slate-900/10 bg-white/68 p-4">
                    <div className={`mb-2 h-2 w-14 rounded-full ${tone === 'teal' ? 'bg-teal-600' : tone === 'cyan' ? 'bg-cyan-600' : 'bg-orange-500'}`} />
                    <div className="font-display text-base font-bold">{label}</div>
                    <div className="mt-1 text-sm leading-6 text-text-2">{body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-teal-700">How it works</div>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight">From idea to build map in 4 steps</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map(step => {
              const Icon = step.icon
              return (
                <div key={step.n} className="telemetry-card p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-text-3">{step.n}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700/10 text-teal-700"><Icon size={20} /></span>
                  </div>
                  <h3 className="font-display text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-2">{step.body}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-9 text-center">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-orange-600">Features</div>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight">Everything you need to ship</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(([title, body], i) => (
              <div key={title} className="rounded-2xl border border-slate-900/10 bg-white/72 p-6 shadow-sm backdrop-blur-xl">
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-white ${i % 3 === 0 ? 'bg-teal-700' : i % 3 === 1 ? 'bg-cyan-600' : 'bg-orange-500'}`}>
                  <Zap size={19} />
                </div>
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-2">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <div className="telemetry-card p-8">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-teal-700">Pricing</div>
            <h2 className="mt-3 font-display text-4xl font-extrabold">Simple, useful, free</h2>
            <div className="my-7 font-display text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-600 to-orange-500">$0</div>
            <p className="mx-auto max-w-xl text-text-2">Unlimited projects, AI build plans, architecture builder, phase prompts, deploy guide, and error-fix assistant.</p>
            <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-700 via-cyan-600 to-orange-500 px-7 py-4 font-display font-extrabold text-white no-underline">
              Get started free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900/10 px-5 py-8 text-center text-sm text-text-3">
        <div className="font-display text-lg font-extrabold text-text">Torus<span className="text-violet-DEFAULT">AI</span></div>
        <div className="mt-2">Build anything. Ship with a plan.</div>
      </footer>
    </div>
  )
}
