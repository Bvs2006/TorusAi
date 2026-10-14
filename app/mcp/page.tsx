import Link from 'next/link'
import { headers } from 'next/headers'
import McpIdeOptions from '@/components/McpIdeOptions'
import {
  ArrowLeft,
  Boxes,
  ClipboardList,
  Code2,
  PlugZap,
  Rocket,
  ServerCog,
  TerminalSquare,
  Wrench,
  Sparkles,
  Layers,
  Terminal,
  ExternalLink,
  CheckCircle2
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'Add Torus MCP to IDE',
  description: 'Install the Torus AI MCP server in your IDE and generate features, architecture, development guides, deployment guides, and tool recommendations from an idea.'
}

export default async function McpInstallPage() {
  const headerStore = await headers()
  const host = headerStore.get('host') || 'localhost:3000'
  const protocol = headerStore.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
  const mcpUrl = `${appUrl.replace(/\/$/, '')}/api/mcp`
  const config = {
    mcpServers: {
      'torus-ai-builder': {
        url: mcpUrl
      }
    }
  }
  const cursorConfig = Buffer.from(JSON.stringify(config.mcpServers['torus-ai-builder'])).toString('base64')
  const cursorInstallUrl = `cursor://anysphere.cursor-deeplink/mcp/install?name=torus-ai-builder&config=${encodeURIComponent(cursorConfig)}`
  const configText = JSON.stringify(config, null, 2)

  const isLocal = host.includes('localhost')
  const stdioConfig = {
    mcpServers: {
      'torus-ai-builder': {
        command: 'node',
        args: ['mcp/torus-mcp-server.mjs'],
        env: { TORUS_BASE_URL: appUrl.replace(/\/$/, '') }
      }
    }
  }
  const stdioConfigText = JSON.stringify(stdioConfig, null, 2)

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-[#08080c] text-neutral-900 dark:text-white/90 selection:bg-purple-500/30 selection:text-white p-6 md:p-14 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Ambient Top Glow & Grid Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-600/20 dark:via-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 dark-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors bg-neutral-100 hover:bg-neutral-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/10"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <ThemeToggle />
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-4">
            <PlugZap size={13} className="text-purple-600 dark:text-purple-400" />
            <span>Model Context Protocol (MCP)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 dark:text-white tracking-tight mb-4 leading-tight">
            Add Torus MCP to your IDE.
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg max-w-3xl leading-relaxed">
            Install the Torus planning server into Cursor, VS Code, Claude Desktop, or Windsurf. Plan software architectures directly from your code editor without context switching.
          </p>
        </div>

        {/* IDE Selector Component */}
        <div className="mb-12 bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl">
          <McpIdeOptions mcpUrl={mcpUrl} cursorInstallUrl={cursorInstallUrl} />
        </div>

        {/* Feature Capabilities Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Layers size={18} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Capabilities Unlocked in Your IDE</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Code2, title: 'Idea to Architecture Brief', text: 'Type your raw idea inside Cursor or Claude to receive an instant tech stack and modular blueprint.' },
              { icon: Boxes, title: 'Feature Decomposition', text: 'Receive prioritized must-have and nice-to-have features with complexity ratings and technical rationale.' },
              { icon: ServerCog, title: 'Service Topology', text: 'Get full-stack service boundaries, database schemas, auth strategies, and vector integrations.' },
              { icon: ClipboardList, title: '7-Phase Build Prompts', text: 'Follow structured, copy-paste prompts engineered for autonomous code generators.' },
              { icon: Rocket, title: 'Production Deployment', text: 'Access verified hosting CLI steps, required env vars, and health-check scripts.' },
              { icon: Wrench, title: 'Tool Recommendation Hub', text: 'Discover recommended AI models, embeddings, and developer tools for each project phase.' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white dark:bg-[#0c0d15] border border-neutral-200/80 dark:border-white/[0.08] hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group shadow-sm dark:shadow-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Manual Configuration & JSON Snippet */}
        <div className="bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl mb-16">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block mb-1">
                Manual Configuration
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-mono">mcp.json</h3>
            </div>
            <span className="text-xs font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-3 py-1 rounded-full font-semibold">
              JSON-RPC 2.0
            </span>
          </div>

          <pre className="p-6 rounded-2xl bg-neutral-900 dark:bg-[#08080d] border border-neutral-800 dark:border-white/5 font-mono text-xs sm:text-sm text-purple-200 leading-relaxed overflow-x-auto">
            {configText}
          </pre>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed font-mono">
            {isLocal ? (
              <>Local development: points to <code className="text-purple-600 dark:text-white font-semibold">{mcpUrl}</code>. For production, deploy to Vercel and use your public URL.</>
            ) : (
              <>Paste this snippet into your IDE&apos;s MCP settings file (<code className="text-neutral-900 dark:text-white">~/.cursor/mcp.json</code> or VS Code settings).</>
            )}
          </p>
        </div>

        {/* Deployment Options Comparison */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-3">
            <Rocket size={13} className="text-purple-600 dark:text-purple-400" />
            <span>Architecture & Deployment</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-neutral-900 dark:text-white tracking-tight mb-8">
            How to deploy your Torus MCP server
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Remote HTTP */}
            <div className="bg-white dark:bg-[#0c0d15] border border-purple-300 dark:border-purple-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-neutral-900 dark:text-white">Option A: Remote Streamable HTTP</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Zero-maintenance deployment. The MCP server deploys with your Next.js app on Vercel at <code className="text-purple-600 dark:text-purple-300 font-semibold">/api/mcp</code>.
              </p>
              <ol className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">1.</span>
                  <span>Deploy to Vercel: <code className="text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/5 px-1 py-0.5 rounded">npx vercel --prod</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">2.</span>
                  <span>Set environment variables (<code className="text-neutral-600 dark:text-neutral-400">GROQ_API_KEY</code>, <code className="text-neutral-600 dark:text-neutral-400">SEARXNG_BASE_URL</code>)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">3.</span>
                  <span>Add production URL to your IDE MCP settings</span>
                </li>
              </ol>
            </div>

            {/* Local Stdio */}
            <div className="bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-neutral-900 dark:text-white">Option B: Local Node stdio</span>
                <span className="text-[10px] font-mono uppercase bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full">
                  Offline / Dev
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Run directly via Node.js stdio communication while hacking locally on your machine.
              </p>
              <pre className="p-4 rounded-xl bg-neutral-900 dark:bg-[#08080d] border border-neutral-800 dark:border-white/5 font-mono text-[11px] text-neutral-200 overflow-x-auto leading-relaxed">
                {stdioConfigText}
              </pre>
            </div>

          </div>
        </div>

      </div>

    </main>
  )
}
