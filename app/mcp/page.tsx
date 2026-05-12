import Link from 'next/link'
import { headers } from 'next/headers'
import {
  ArrowLeft,
  Boxes,
  ClipboardList,
  Code2,
  ExternalLink,
  PlugZap,
  Rocket,
  ServerCog,
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

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', padding: '48px 24px 96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <Link href="/#mcp" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: 700, marginBottom: '40px' }}>
          <ArrowLeft size={16} /> Back to landing
        </Link>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(360px, 0.8fr)', gap: '36px', alignItems: 'start' }} className="mcp-install-layout">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '20px', fontSize: '12px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <PlugZap size={14} /> IDE MCP install
            </div>
            <h1 style={{ margin: '0 0 18px', color: 'var(--text-heading)', fontFamily: 'Syne, sans-serif', fontSize: '56px', lineHeight: 1.04, letterSpacing: '-1px' }}>
              Add Torus MCP to your IDE.
            </h1>
            <p style={{ margin: '0 0 28px', color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.65, maxWidth: '720px' }}>
              After installation, ask your IDE: “Use Torus to plan my idea.” The MCP tool returns features, architecture, development prompts, deployment steps, and recommended AI tools/services from your hosted Torus app.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '36px' }}>
              <a href={cursorInstallUrl} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '52px', padding: '0 24px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan) 58%, var(--accent-orange))', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 10px 24px rgba(66,127,131,0.22)' }}>
                <PlugZap size={18} /> Add to Cursor
              </a>
              <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '52px', padding: '0 22px', borderRadius: '14px', border: '1px solid var(--border-subtle)', background: 'var(--surface-overlay)', color: 'var(--text-heading)', fontWeight: 800, textDecoration: 'none' }}>
                MCP Docs <ExternalLink size={16} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
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
                Deploy Torus to Vercel, then add this remote MCP config in your IDE settings. In local development this points to <strong>localhost:3000</strong>; in production it points to your deployed <strong>/api/mcp</strong> endpoint.
              </div>
            </div>
          </aside>
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
