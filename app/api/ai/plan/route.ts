// app/api/ai/plan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { askGroq, parseJSON } from '@/lib/groq'
import { search, formatSearchResults } from '@/lib/searxng'
import type { AIPlanResponse } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { idea, platform, experience, budget, features, targetUsers } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    // Parallel web searches for best tools
    const budgetFilter = budget === 'free' ? 'free tier only' : ''
    const [frontendResults, backendResults, dbResults, authResults, aiResults] = await Promise.all([
      search(`best ${platform} frontend framework ${budgetFilter} 2025`),
      search(`best backend API framework ${platform} ${budgetFilter} 2025`),
      search(`best database for ${features?.slice(0,3).join(' ')} app ${budgetFilter} 2025`),
      search(`best authentication library ${platform} ${budgetFilter} 2025`),
      search(`best AI API LLM ${budgetFilter} 2025`),
    ])

    const prompt = `You are Torus AI, a project planning expert. Analyze the search results and select the BEST technology stack for this project.

PROJECT DETAILS:
- Idea: "${idea}"
- Platform: ${platform}
- Developer Experience: ${experience}
- Budget: ${budget}
- Target Users: ${targetUsers || 'General users'}
- Key Features: ${features?.join(', ') || 'Standard features'}

CURRENT SEARCH RESULTS:
Frontend options: ${formatSearchResults(frontendResults)}

Backend options: ${formatSearchResults(backendResults)}

Database options: ${formatSearchResults(dbResults)}

Auth options: ${formatSearchResults(authResults)}

AI Service options: ${formatSearchResults(aiResults)}

Based on these results, select the BEST tool for each category for this SPECIFIC project.
Prioritize: free tier availability (if budget=free), ease of use (if beginner), performance.

Respond with ONLY valid JSON, no markdown:
{
  "stack": {
    "frontend": {"name": "Next.js", "reason": "Best for web with built-in routing and Vercel deployment", "free": true},
    "backend": {"name": "Next.js API Routes", "reason": "Zero extra setup, deploys with frontend", "free": true},
    "database": {"name": "Supabase", "reason": "Free 500MB + Auth + Realtime included", "free": true},
    "auth": {"name": "Supabase Auth", "reason": "Free OAuth + email, integrated with DB", "free": true},
    "ai": {"name": "Groq", "reason": "14,400 free req/day, fastest inference", "free": true},
    "deployment": {"name": "Vercel", "reason": "Zero-config Next.js, free tier", "free": true}
  },
  "phases": [
    {"phase_number": 1, "name": "Project Setup & Config", "tool": "Cursor", "duration": "2-3h"},
    {"phase_number": 2, "name": "Authentication System", "tool": "Windsurf", "duration": "3-4h"},
    {"phase_number": 3, "name": "Database Schema & API", "tool": "Cursor", "duration": "4-5h"},
    {"phase_number": 4, "name": "Core UI Components", "tool": "v0 + Windsurf", "duration": "5-6h"},
    {"phase_number": 5, "name": "Business Logic", "tool": "Windsurf", "duration": "4-5h"},
    {"phase_number": 6, "name": "AI & Real-time Features", "tool": "Cursor", "duration": "3-4h"},
    {"phase_number": 7, "name": "Testing & Deployment", "tool": "Vercel", "duration": "2-3h"}
  ],
  "estimated_hours": 23,
  "complexity": "medium"
}`

    const raw = await askGroq(prompt, 1200)
    const plan = parseJSON<AIPlanResponse>(raw)

    if (!plan) {
      return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 500 })
    }

    return NextResponse.json(plan)

  } catch (error: any) {
    console.error('Plan API error:', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}
