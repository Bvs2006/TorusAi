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
  Wrench
} from 'lucide-react'

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
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', padding: '48px 24px 96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <Link href="/#mcp" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: 700, marginBottom: '40px' }}>
          <ArrowLeft size={16} /> Back to landing
        </Link>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '36px', alignItems: 'start' }} className="mcp-install-layout">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '20px', fontSize: '12px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <PlugZap size={14} /> IDE MCP install
            </div>
            <h1 style={{ margin: '0 0 18px', color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: '56px', lineHeight: 1.04, letterSpacing: '-1px' }}>
              Add Torus MCP to your IDE.
            </h1>
            <p style={{ margin: '0 0 28px', color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.65, maxWidth: '720px' }}>
              Pick your IDE below — Cursor, VS Code, Claude Desktop, Windsurf, or any MCP-compatible editor. After install, ask: &ldquo;Use Torus to plan my idea.&rdquo;
            </p>

            <McpIdeOptions mcpUrl={mcpUrl} cursorInstallUrl={cursorInstallUrl} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '36px' }}>
              {[
                { icon: Code2, title: 'Idea input', text: 'Type your app, product, or MCP idea directly inside the IDE.' },
                { icon: Boxes, title: 'Features', text: 'Receive must-have and optional features with complexity and reasoning.' },
                { icon: ServerCog, title: 'Architecture', text: 'Get stack, services, data, AI, auth, and integration guidance.' },
                { icon: ClipboardList, title: 'Development guide', text: 'Follow phased prompts built for AI coding tools.' },
                { icon: Rocket, title: 'Deployment guide', text: 'See hosting, env vars, checks, and production rollout steps.' },
                { icon: Wrench, title: 'Tool links', text: 'Use recommended AI tools and services for each project layer.' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} style={{ padding: '22px', border: '1px solid var(--border-subtle)', borderRadius: '18px', background: 'var(--surface-overlay)', boxShadow: 'var(--card-shadow)' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--focus)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <Icon size={20} />
                    </div>
                    <h2 style={{ margin: '0 0 8px', fontSize: '17px', color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif' }}>{item.title}</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <aside style={{ border: '1px solid var(--border-subtle)', borderRadius: '24px', background: 'var(--surface-overlay)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
            <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Manual install</div>
              <h2 style={{ margin: 0, color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: '24px' }}>mcp.json</h2>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ borderRadius: '16px', background: '#0b1220', color: '#dbeafe', border: '1px solid rgba(255,255,255,0.08)', padding: '18px', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                {configText}
              </div>
              <div style={{ marginTop: '18px', color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.55 }}>
                {isLocal ? (
                  <>Local dev: this points to <strong>{mcpUrl}</strong>. For production, deploy Torus to Vercel first, then swap the URL to your deployed <strong>/api/mcp</strong> endpoint.</>
                ) : (
                  <>Works with <strong>Cursor</strong>, <strong>VS Code</strong>, <strong>Claude Desktop</strong>, <strong>Windsurf</strong>, and other MCP editors. Pick your IDE above for the exact config file path.</>
                )}
              </div>
            </div>
          </aside>
        </section>

        {/* Deployment Guide */}
        <section style={{ marginTop: '72px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '20px', fontSize: '12px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Rocket size={14} /> Deploy MCP
          </div>
          <h2 style={{ margin: '0 0 12px', color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: '36px', letterSpacing: '-0.5px' }}>
            How to deploy the MCP server
          </h2>
          <p style={{ margin: '0 0 40px', color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.65, maxWidth: '720px' }}>
            Torus MCP ships with the app — no separate MCP hosting. Deploy the Next.js app and the <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px' }}>/api/mcp</code> endpoint goes live automatically.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {/* Remote HTTP */}
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '20px', background: 'var(--surface-overlay)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--focus)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <ServerCog size={18} color="var(--accent-teal)" />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)' }}>Option A — Remote HTTP</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-teal)', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '999px', padding: '3px 10px' }}>Recommended</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Best for production and team sharing</p>
              </div>
              <ol style={{ margin: 0, padding: '20px 24px 20px 40px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li style={{ marginBottom: '10px' }}>Deploy Torus to Vercel: <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>npx vercel --prod</code></li>
                <li style={{ marginBottom: '10px' }}>Add env vars in Vercel (Firebase, Groq, SearXNG, <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>NEXT_PUBLIC_APP_URL</code>)</li>
                <li style={{ marginBottom: '10px' }}>Verify: <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>curl https://your-app.vercel.app/api/mcp</code></li>
                <li style={{ marginBottom: '10px' }}>Add the remote <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>mcp.json</code> config to Cursor or VS Code</li>
                <li>Ask your IDE: &ldquo;Use Torus to plan my idea&rdquo;</li>
              </ol>
            </div>

            {/* Local stdio */}
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '20px', background: 'var(--surface-overlay)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <TerminalSquare size={18} color="var(--accent-cyan)" />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)' }}>Option B — Local stdio</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Best for local dev when Torus runs on localhost</p>
              </div>
              <ol style={{ margin: 0, padding: '20px 24px 20px 40px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li style={{ marginBottom: '10px' }}>Start Torus: <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>npm run dev</code></li>
                <li style={{ marginBottom: '10px' }}>Use the stdio config below in <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>.cursor/mcp.json</code></li>
                <li style={{ marginBottom: '10px' }}>Or run manually: <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>npm run mcp</code></li>
                <li>Set <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>TORUS_BASE_URL</code> to your Vercel URL to point at production</li>
              </ol>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                Remote HTTP mcp.json (production)
              </div>
              <pre style={{ margin: 0, padding: '18px', background: '#0b1220', color: '#dbeafe', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.7, overflow: 'auto' }}>
                {configText}
              </pre>
            </div>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                Local stdio mcp.json (development)
              </div>
              <pre style={{ margin: 0, padding: '18px', background: '#0b1220', color: '#dbeafe', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.7, overflow: 'auto' }}>
                {stdioConfigText}
              </pre>
            </div>
          </div>

          <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Full guide: <code style={{ fontFamily: 'DM Mono, monospace' }}>mcp/README.md</code> in the repo.
          </p>
        </section>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .mcp-install-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
