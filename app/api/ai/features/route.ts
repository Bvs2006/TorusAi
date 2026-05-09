import { NextRequest, NextResponse } from 'next/server'
import { askGroq } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { idea, platform, stack } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    const stackContext = stack ? `
Tech Stack:
- Frontend: ${stack.frontend?.name}
- Backend: ${stack.backend?.name}
- Database: ${stack.database?.name}
- Auth: ${stack.auth?.name}
- AI: ${stack.ai?.name}
- Deployment: ${stack.deployment?.name}` : ''

    const prompt = `You are a Product Manager. Analyze this project idea and recommend 8-12 essential features.

Project Idea: "${idea}"
Platform: ${platform}
${stackContext}

Return ONLY a valid JSON array with no markdown formatting or code blocks. Each feature should have:
- name: feature name (string)
- description: what it does (string)
- priority: "must" (core/critical) or "nice" (enhancement) (string)
- complexity: "low", "medium", or "high" (string)
- why_important: brief explanation of why this feature matters for this specific idea (string)

Example format (return ONLY the array, no wrapping text):
[
  {"name": "User Authentication", "description": "Sign up, login, and password management", "priority": "must", "complexity": "medium", "why_important": "Essential foundation for user accounts"},
  {"name": "API Integration", "description": "Connect to external services", "priority": "nice", "complexity": "high", "why_important": "Enhances functionality and automation"}
]

Return ONLY valid JSON array.`

    const response = await askGroq(prompt, 1500)
    
    let features = []
    try {
      // Extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        features = JSON.parse(jsonMatch[0])
      } else {
        features = JSON.parse(response)
      }
    } catch (parseErr) {
      console.error('Failed to parse features:', parseErr)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    return NextResponse.json({ features })
  } catch (err: any) {
    console.error('Error generating features:', err)
    return NextResponse.json({ error: err.message || 'Failed to generate features' }, { status: 500 })
  }
}
