'use client'

import { useState } from 'react'
import {
  Boxes,
  Check,
  Copy,
  ExternalLink,
  Monitor,
  PlugZap,
  ServerCog,
  TerminalSquare,
  Wind
} from 'lucide-react'
import { showToast } from '@/components/ui'

type IdeOption = {
  id: string
  name: string
  icon: typeof ServerCog
  configPath: string
  docsUrl: string
  steps: string[]
  oneClickUrl?: string
  getConfig: (mcpUrl: string) => object
}

function buildRemoteConfig(mcpUrl: string) {
  return {
    mcpServers: {
      'torus-ai-builder': {
        url: mcpUrl,
      },
    },
  }
}

function buildWindsurfConfig(mcpUrl: string) {
  return {
    mcpServers: {
      'torus-ai-builder': {
        serverUrl: mcpUrl,
      },
    },
  }
}

function buildClaudeConfig(mcpUrl: string) {
  return {
    mcpServers: {
      'torus-ai-builder': {
        url: mcpUrl,
      },
    },
  }
}

export default function McpIdeOptions({
  mcpUrl,
  cursorInstallUrl,
}: {
  mcpUrl: string
  cursorInstallUrl: string
}) {
  const ides: IdeOption[] = [
    {
      id: 'cursor',
      name: 'Cursor',
      icon: ServerCog,
      configPath: '.cursor/mcp.json (project) or ~/.cursor/mcp.json (global)',
      docsUrl: 'https://docs.cursor.com/context/mcp',
      oneClickUrl: cursorInstallUrl,
      steps: [
        'Click "Add to Cursor" or paste the config into .cursor/mcp.json',
        'Restart Cursor completely',
        'Open Settings → MCP and confirm torus-ai-builder is connected',
        'Ask: "Use Torus to plan my idea: [your app idea]"',
      ],
      getConfig: buildRemoteConfig,
    },
    {
      id: 'vscode',
      name: 'VS Code + Copilot',
      icon: TerminalSquare,
      configPath: '.vscode/mcp.json (project) or user settings MCP section',
      docsUrl: 'https://code.visualstudio.com/docs/copilot/customization/mcp-servers',
      steps: [
        'Create .vscode/mcp.json in your project root',
        'Paste the config below and save',
        'Reload VS Code window (Cmd/Ctrl + Shift + P → Reload Window)',
        'Open Copilot Chat and ask Torus to plan your idea',
      ],
      getConfig: buildRemoteConfig,
    },
    {
      id: 'claude',
      name: 'Claude Desktop',
      icon: Boxes,
      configPath: '~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\Claude\\claude_desktop_config.json (Windows)',
      docsUrl: 'https://docs.claude.com/en/docs/claude-code/mcp',
      steps: [
        'Open your Claude Desktop config file',
        'Add the torus-ai-builder entry under mcpServers',
        'Save and fully quit Claude Desktop, then reopen',
        'Ask Claude to use Torus to plan your project idea',
      ],
      getConfig: buildClaudeConfig,
    },
    {
      id: 'windsurf',
      name: 'Windsurf',
      icon: Wind,
      configPath: '~/.codeium/windsurf/mcp_config.json',
      docsUrl: 'https://docs.windsurf.com/windsurf/cascade/mcp',
      steps: [
        'Open Windsurf MCP settings or mcp_config.json',
        'Paste the config (uses serverUrl field for Windsurf)',
        'Restart Windsurf',
        'In Cascade, ask Torus to plan your idea',
      ],
      getConfig: buildWindsurfConfig,
    },
    {
      id: 'other',
      name: 'Other IDE / Agent',
      icon: Monitor,
      configPath: 'Your IDE MCP settings file',
      docsUrl: 'https://modelcontextprotocol.io',
      steps: [
        'Find your IDE\'s MCP or tools configuration',
        'Add a remote HTTP server pointing to the Torus MCP URL',
        'Restart the IDE after saving',
        'Call the torus_build_idea tool with your product idea',
      ],
      getConfig: buildRemoteConfig,
    },
  ]

  const [activeId, setActiveId] = useState('cursor')
  const [copied, setCopied] = useState(false)

  const active = ides.find((ide) => ide.id === activeId) || ides[0]
  const configText = JSON.stringify(active.getConfig(mcpUrl), null, 2)
  const ActiveIcon = active.icon

  async function copyConfig() {
    await navigator.clipboard.writeText(configText)
    setCopied(true)
    showToast('✓ Config copied!')
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
          Choose your IDE
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {ides.map((ide) => {
            const Icon = ide.icon
            const selected = ide.id === activeId
            return (
              <button
                key={ide.id}
                type="button"
                onClick={() => setActiveId(ide.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${selected ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                  background: selected ? 'var(--focus)' : 'var(--surface-overlay)',
                  color: selected ? 'var(--accent-teal)' : 'var(--text-muted)',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {ide.name}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '20px', background: 'var(--surface-overlay)', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--focus)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ActiveIcon size={22} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Syne, sans-serif', fontSize: '22px', color: 'var(--text-heading)' }}>
                Install in {active.name}
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Config file: <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>{active.configPath}</code>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {active.oneClickUrl && (
              <a
                href={active.oneClickUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))',
                  color: '#fff',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                <PlugZap size={16} /> Add to Cursor
              </a>
            )}
            <button
              type="button"
              onClick={copyConfig}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg)',
                color: 'var(--text-heading)',
                fontFamily: 'Syne, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy config'}
            </button>
            <a
              href={active.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg)',
                color: 'var(--text-heading)',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              {active.name} docs <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 0.9fr)', gap: 0 }} className="mcp-ide-detail">
          <div style={{ padding: '24px', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '14px' }}>
              Setup steps
            </div>
            <ol style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.75 }}>
              {active.steps.map((step) => (
                <li key={step} style={{ marginBottom: '10px' }}>{step}</li>
              ))}
            </ol>
            <div style={{ marginTop: '20px', padding: '14px 16px', borderRadius: '12px', background: 'var(--focus)', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--text-heading)' }}>Example prompt:</strong>{' '}
              &ldquo;Use Torus to plan my idea: a Next.js SaaS dashboard with AI recommendations.&rdquo;
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>
                {active.id === 'windsurf' ? 'mcp_config.json' : 'mcp.json'}
              </div>
              <code style={{ fontSize: '11px', color: 'var(--accent-teal)', fontFamily: 'DM Mono, monospace' }}>{mcpUrl}</code>
            </div>
            <pre style={{ margin: 0, borderRadius: '14px', background: '#0b1220', color: '#dbeafe', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: 1.7, overflow: 'auto', maxHeight: '280px' }}>
              {configText}
            </pre>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .mcp-ide-detail {
            grid-template-columns: 1fr !important;
          }
          .mcp-ide-detail > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--border-subtle);
          }
        }
      `}</style>
    </div>
  )
}
