import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ArrowDownToLine,
  ArrowRight,
  Command,
  Eye,
  FileCode2,
  GitFork,
  Menu,
  Search,
  Star,
  Upload,
  Users,
} from 'lucide-react'

const kits = [
  {
    name: 'Atlas Product UI',
    author: 'Mira Chen',
    category: 'SaaS',
    downloads: '18.4k',
    stars: '4.9',
    tokens: ['React', 'Figma', 'Tokens'],
    preview: ['#6366F1', '#0A0A0A', '#E8E8EC'],
  },
  {
    name: 'Northstar Mobile Kit',
    author: 'Devon Park',
    category: 'Mobile',
    downloads: '12.1k',
    stars: '4.8',
    tokens: ['iOS', 'Android', 'Dark'],
    preview: ['#10B981', '#111827', '#F4F4F5'],
  },
  {
    name: 'Ledger Admin System',
    author: 'Ari Morgan',
    category: 'Dashboard',
    downloads: '9.7k',
    stars: '4.7',
    tokens: ['Tables', 'Charts', 'WCAG'],
    preview: ['#F59E0B', '#0A0A0A', '#FAFAFA'],
  },
]

const stats = [
  ['2,840', 'published files'],
  ['91k', 'monthly downloads'],
  ['12k', 'contributors'],
]

const rows = [
  ['DESIGN.md', 'Brand highlight standard', 'Published'],
  ['tokens.json', 'Color, type, spacing exports', 'Synced'],
  ['components.fig', 'Editable component library', 'Updated'],
]

export default async function LandingPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-bg text-text">
      <nav className="sticky top-0 z-50 h-14 border-b border-surface-2 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="font-display text-xl font-bold text-text no-underline">
            Genesis
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {[
              ['#library', 'Library'],
              ['#workflow', 'Workflow'],
              ['#community', 'Community'],
              ['/tools', 'Tool Hub'],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2 text-sm font-medium text-text-2 no-underline transition hover:bg-bg-2 hover:text-text"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden h-[38px] items-center rounded-md border border-surface-2 px-4 text-sm font-medium text-text-2 no-underline transition hover:-translate-y-px hover:bg-bg-2 hover:text-text sm:flex"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-[38px] items-center rounded-md bg-violet-DEFAULT px-4 text-sm font-medium text-white no-underline transition hover:-translate-y-px hover:bg-violet-2 hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
            >
              Publish a file
            </Link>
            <button title="Open navigation" className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-md border border-surface-2 bg-transparent text-text-2 md:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden border-b border-surface-2">
          <div className="editorial-grid pointer-events-none absolute inset-0" />
          <div className="mx-auto grid min-h-[calc(100vh-56px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.03fr_.97fr]">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-bg-2 px-3 py-1 text-xs font-medium text-text-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                Community design systems
              </div>
              <h1 className="max-w-4xl font-display text-[52px] font-bold leading-[0.98] text-text sm:text-[60px] lg:text-[72px]">
                Discover files that make product teams faster.
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-text-2">
                Genesis is a precise publishing surface for developers to share, inspect, and download production-ready design system files.
              </p>
              <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-xl border border-surface-2 bg-surface p-2">
                <Search size={18} className="ml-3 text-text-3" />
                <span className="flex-1 text-sm text-text-3">Search kits, tokens, components, authors</span>
                <span className="inline-flex items-center gap-1 rounded border border-surface-2 bg-bg-2 px-2 py-1 font-mono text-[11px] text-text-2">
                  <Command size={12} /> K
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-violet-DEFAULT px-6 text-sm font-medium text-white no-underline transition hover:-translate-y-px hover:bg-violet-2 hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
                >
                  Start publishing <ArrowRight size={17} />
                </Link>
                <Link
                  href="#library"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-surface-2 px-6 text-sm font-medium text-text no-underline transition hover:-translate-y-px hover:bg-bg-2"
                >
                  Browse library
                </Link>
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-xl border border-surface-2 bg-surface">
                <div className="flex items-center justify-between border-b border-surface-2 p-5">
                  <div>
                    <div className="font-mono text-[11px] uppercase text-text-3">Featured release</div>
                    <div className="mt-1 font-display text-2xl font-bold">Interface OS</div>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-success">Published</span>
                </div>
                <div className="h-[200px] border-b border-surface-2 bg-bg-2 p-5">
                  <div className="grid h-full grid-cols-4 gap-3">
                    <div className="col-span-2 rounded-lg bg-surface p-4">
                      <div className="mb-4 h-3 w-24 rounded bg-violet-DEFAULT" />
                      <div className="space-y-2">
                        <div className="h-3 rounded bg-[#D4D4D8]" />
                        <div className="h-3 w-2/3 rounded bg-[#D4D4D8]" />
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#0A0A0A]" />
                    <div className="grid gap-3">
                      <div className="rounded-lg bg-violet-DEFAULT" />
                      <div className="rounded-lg bg-[#E8E8EC]" />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-surface-2">
                  {rows.map(([file, label, status]) => (
                    <div key={file} className="flex items-center justify-between px-5 py-3 transition hover:bg-bg-2">
                      <div className="flex items-center gap-3">
                        <FileCode2 size={18} className={file === 'DESIGN.md' ? 'text-[#20970B]' : 'text-text-3'} />
                        <div>
                          <div className={file === 'DESIGN.md' ? 'font-mono text-sm font-medium text-[#20970B]' : 'font-mono text-sm font-medium text-text'}>
                            {file}
                          </div>
                          <div className="text-xs text-text-3">{label}</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-bg-2 px-3 py-1 text-xs text-text-2">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="library" className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="font-mono text-[11px] uppercase text-text-3">Library</div>
              <h2 className="mt-3 font-display text-[32px] font-bold">Gallery-frame file cards</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'SaaS', 'Mobile', 'Dashboard', 'Tokens'].map((chip, index) => (
                <button
                  key={chip}
                  className={index === 0 ? 'rounded-full bg-violet-DEFAULT px-3 py-1 text-xs text-white' : 'rounded-full bg-bg-2 px-3 py-1 text-xs text-text-2 transition hover:text-text'}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {kits.map(kit => (
              <article key={kit.name} className="overflow-hidden rounded-xl border border-surface-2 bg-surface transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <div className="h-[200px] border-b border-surface-2 bg-bg-2 p-4">
                  <div className="grid h-full grid-cols-3 gap-3">
                    {kit.preview.map(color => (
                      <div key={color} className="rounded-lg" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold">{kit.name}</h3>
                      <p className="mt-1 text-sm text-text-2">{kit.category} system by {kit.author}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-bg-2 text-center text-sm font-medium leading-9 text-text">
                      {kit.author.split(' ').map(part => part[0]).join('')}
                    </div>
                  </div>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {kit.tokens.map(token => (
                      <span key={token} className="rounded-full bg-bg-2 px-3 py-1 text-xs text-text-2">{token}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-surface-2 pt-4 text-sm text-text-2">
                    <span className="inline-flex items-center gap-1"><ArrowDownToLine size={15} /> {kit.downloads}</span>
                    <span className="inline-flex items-center gap-1"><Star size={15} /> {kit.stars}</span>
                    <button title={`Preview ${kit.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-surface-2 text-text-2 transition hover:bg-bg-2 hover:text-text">
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="border-y border-surface-2 bg-surface">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="font-mono text-[11px] uppercase text-text-3">Workflow</div>
              <h2 className="mt-3 font-display text-[32px] font-bold">A publishing flow with useful density.</h2>
              <p className="mt-4 text-[15px] leading-7 text-text-2">
                Upload files, attach metadata, validate tokens, and give teams enough context to use the system without a handoff meeting.
              </p>
            </div>
            <div className="divide-y divide-surface-2 rounded-lg border border-surface-2">
              {[
                [Upload, 'Submit source files', 'Figma libraries, token JSON, docs, and implementation snippets.'],
                [GitFork, 'Track versions', 'Show breaking changes, maintainers, and compatible package versions.'],
                [Users, 'Build trust', 'Surface author history, adoption, and community review signals.'],
              ].map(([Icon, title, body]) => {
                const RowIcon = Icon as typeof Upload
                return (
                  <div key={title as string} className="flex items-start justify-between gap-6 px-5 py-4 transition hover:bg-bg-2">
                    <div className="flex gap-4">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-bg-2 text-violet-DEFAULT">
                        <RowIcon size={19} />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold">{title as string}</h3>
                        <p className="mt-1 text-sm leading-6 text-text-2">{body as string}</p>
                      </div>
                    </div>
                    <ArrowRight size={17} className="mt-3 text-text-3" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="community" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-lg border border-surface-2 bg-surface p-6">
                <div className="font-display text-[60px] font-bold leading-none">{value}</div>
                <div className="mt-3 text-sm text-text-2">{label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-2 bg-surface px-6 py-8 text-sm text-text-2">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="font-display text-lg font-bold text-text">Genesis</div>
          <div>Design systems for teams that care about the details.</div>
        </div>
      </footer>
    </div>
  )
}
