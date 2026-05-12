import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type JsonRpcMessage = {
  jsonrpc?: string
  id?: string | number | null
  method?: string
  params?: any
}

const tool = {
  name: 'torus_build_idea',
  description: 'Turn a project idea into Torus AI features, architecture, development guide, deployment guide, and recommended AI tools.',
  inputSchema: {
    type: 'object',
    properties: {
      idea: {
        type: 'string',
        description: 'The app, AI tool, MCP server, or product idea to plan.',
      },
      platform: {
        type: 'string',
        description: 'Target platform such as web, mobile, desktop, browser extension, API, or MCP server.',
        default: 'web',
      },
      experience: {
        type: 'string',
        description: 'Developer experience level: beginner, intermediate, or advanced.',
        default: 'intermediate',
      },
      budget: {
        type: 'string',
        description: 'Budget preference: free, low, or flexible.',
        default: 'free',
      },
    },
    required: ['idea'],
  },
}

export async function POST(req: NextRequest) {
  try {
    const message = await req.json()
    const result = Array.isArray(message)
      ? await Promise.all(message.map(item => handleMessage(item, req.nextUrl.origin)))
      : await handleMessage(message, req.nextUrl.origin)

    return withCors(NextResponse.json(result))
  } catch (error: any) {
    return withCors(NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: error?.message || 'Invalid JSON-RPC request',
      },
    }, { status: 400 }))
  }
}

export async function GET() {
  return withCors(NextResponse.json({
    name: 'torus-ai-builder',
    version: '1.0.0',
    transport: 'streamable-http',
    endpoint: '/api/mcp',
    tools: [tool.name],
  }))
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }))
}

export async function DELETE() {
  return withCors(new NextResponse(null, { status: 204 }))
}

async function handleMessage(message: JsonRpcMessage, origin: string) {
  if (!message?.method) {
    return error(message?.id ?? null, -32600, 'Invalid request')
  }

  if (message.method === 'initialize') {
    return result(message.id, {
      protocolVersion: '2025-06-18',
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: 'torus-ai-builder',
        version: '1.0.0',
      },
    })
  }

  if (message.method === 'notifications/initialized') {
    return null
  }

  if (message.method === 'tools/list') {
    return result(message.id, {
      tools: [tool],
    })
  }

  if (message.method === 'tools/call') {
    const { name, arguments: args = {} } = message.params || {}

    if (name !== tool.name) {
      return error(message.id, -32602, `Unknown tool: ${name}`)
    }

    try {
      const plan = await buildIdeaPlan(args, origin)
      return result(message.id, {
        content: [
          {
            type: 'text',
            text: JSON.stringify(plan, null, 2),
          },
        ],
      })
    } catch (err: any) {
      return error(message.id, -32603, err?.message || 'Failed to build idea plan')
    }
  }

  return error(message.id, -32601, `Unsupported method: ${message.method}`)
}

async function buildIdeaPlan(args: any, origin: string) {
  const idea = String(args.idea || '').trim()
  if (!idea) throw new Error('idea is required')

  const platform = args.platform || 'web'
  const experience = args.experience || 'intermediate'
  const budget = args.budget || 'free'

  const featuresResponse = await postJson(origin, '/api/ai/features', {
    idea,
    platform,
  })

  const features = Array.isArray(featuresResponse?.features)
    ? featuresResponse.features
    : fallbackFeatures(idea)

  const featureNames = features.map((feature: any) => feature.name || feature.title).filter(Boolean)

  const planResponse = await postJson(origin, '/api/ai/plan', {
    idea,
    platform,
    experience,
    budget,
    features: featureNames,
    targetUsers: 'Builders using an AI IDE',
  })

  const stack = planResponse?.stack || fallbackStack()
  const phases = Array.isArray(planResponse?.phases) ? planResponse.phases : fallbackPhases()

  const toolsResponse = await postJson(origin, '/api/ai/recommend-tools', {
    projectIdea: idea,
    platform,
    features,
    stack,
  })

  return {
    idea,
    platform,
    features,
    architecture: {
      overview: `${idea} should be built as a structured ${platform} product with a clear UI layer, API layer, data layer, authentication boundary, AI service layer, and deployment pipeline.`,
      stack,
      phases,
    },
    developmentGuide: phases.map((phase: any) => ({
      phase: phase.name,
      duration: phase.duration,
      recommendedTool: phase.tool,
      prompt: `In my IDE, help me complete "${phase.name}" for this project: ${idea}. Use the selected stack, keep the work incremental, explain files changed, add validation, and finish with tests or manual checks.`,
    })),
    deploymentGuide: {
      recommendedPlatform: stack.deployment?.name || 'Vercel',
      steps: [
        'Create production environment variables for auth, database, and AI providers.',
        'Run the build locally and fix all TypeScript or lint errors.',
        'Deploy the web/API app to the recommended hosting platform.',
        'Connect custom domain, observability, and error monitoring.',
        'Run one end-to-end test using a real user idea.',
      ],
    },
    recommendedTools: toolsResponse?.tools?.length ? toolsResponse.tools : fallbackTools(),
  }
}

async function postJson(origin: string, path: string, body: any) {
  try {
    const response = await fetch(`${origin}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

function result(id: JsonRpcMessage['id'], value: any) {
  return { jsonrpc: '2.0', id, result: value }
}

function error(id: JsonRpcMessage['id'], code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } }
}

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id')
  response.headers.set('Access-Control-Expose-Headers', 'Mcp-Session-Id')
  response.headers.set('Cache-Control', 'no-store')
  return response
}

function fallbackFeatures(idea: string) {
  return [
    {
      name: 'Idea intake',
      description: `Capture the user's raw idea for ${idea}.`,
      priority: 'must',
      complexity: 'low',
      why_important: 'The plan starts from the user intent.',
    },
    {
      name: 'Feature planner',
      description: 'Generate core and optional feature sets.',
      priority: 'must',
      complexity: 'medium',
      why_important: 'Users need scope before coding.',
    },
    {
      name: 'Architecture guide',
      description: 'Recommend stack, services, APIs, data models, and integration boundaries.',
      priority: 'must',
      complexity: 'medium',
      why_important: 'Architecture reduces rework.',
    },
    {
      name: 'Development and deployment guide',
      description: 'Provide phased implementation prompts and production deployment steps.',
      priority: 'must',
      complexity: 'medium',
      why_important: 'Builders need execution guidance inside the IDE.',
    },
  ]
}

function fallbackStack() {
  return {
    frontend: { name: 'Next.js', reason: 'Fast web UI with API routes', free: true },
    backend: { name: 'Next.js API Routes', reason: 'Simple full-stack deployment', free: true },
    database: { name: 'Firebase Firestore', reason: 'Integrated database for Torus user data', free: true },
    auth: { name: 'Firebase Auth', reason: 'Current Torus authentication provider', free: true },
    ai: { name: 'Groq or OpenAI', reason: 'LLM planning and generation', free: false },
    deployment: { name: 'Vercel', reason: 'Best fit for Next.js apps', free: true },
  }
}

function fallbackPhases() {
  return [
    { phase_number: 1, name: 'Setup and dependencies', tool: 'Cursor', duration: '1-2h' },
    { phase_number: 2, name: 'Core backend logic and data models', tool: 'Cursor', duration: '3-4h' },
    { phase_number: 3, name: 'UI components and state management', tool: 'v0 + Cursor', duration: '3-5h' },
    { phase_number: 4, name: 'Integration and testing', tool: 'Cursor', duration: '2-4h' },
    { phase_number: 5, name: 'Edge cases and error handling', tool: 'Cursor', duration: '2-3h' },
    { phase_number: 6, name: 'Testing and polish', tool: 'Cursor', duration: '2-3h' },
    { phase_number: 7, name: 'Deployment', tool: 'Vercel', duration: '1-2h' },
  ]
}

function fallbackTools() {
  return [
    { name: 'Cursor', category: 'Code', layer: 'Development', reason: 'Runs MCP tools inside the IDE.' },
    { name: 'GitHub Copilot', category: 'Code', layer: 'Development', reason: 'Assists with implementation and refactoring.' },
    { name: 'Firebase', category: 'Database', layer: 'Backend', reason: 'Provides auth and Firestore for product data.' },
    { name: 'Vercel', category: 'DevOps', layer: 'Deployment', reason: 'Simple production hosting for Next.js.' },
  ]
}
