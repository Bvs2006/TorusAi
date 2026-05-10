import { askGroq } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { projectIdea, features, teamName, teamSize, platform, stack } = await req.json()

    const prompt = `You are a professional software architect and team lead. Your goal is to divide a project into exactly ${teamSize} logical and efficient development roles for a team named "${teamName}".

Project Context:
- Idea: "${projectIdea}"
- Platform: ${platform}
- Key Features: ${Array.isArray(features) ? features.join(', ') : 'Not specified'}
- Planned Stack: ${JSON.stringify(stack)}

Requirements for each role:
1. Title: Professional title (e.g., "Full-stack UI Engineer", "AI & Backend Specialist").
2. Focus: A one-sentence description of their primary responsibility.
3. Tasks: 3-5 high-level development tasks they should own.
4. Tools: 2-4 AI tools from the project stack or general best practices that will help them execute.

Dividing Logic:
- If team size is 1: Role covers everything (Lead Developer).
- If team size is 2-3: Split into Core Frontend, Backend/AI, and potentially Product/QA.
- If team size is 4+: More granular splits (UI/UX, Backend, AI/Data, DevOps/Cloud).

Format your response as ONLY valid JSON (no markdown, no preamble):
{
  "roles": [
    {
      "title": "Role Title",
      "focus": "Core focus area",
      "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"],
      "tools": ["Recommended AI Tool 1", "Recommended AI Tool 2"]
    }
  ]
}

RESPOND ONLY WITH JSON:`

    const response = await askGroq(prompt, 1800)
    
    let jsonStr = response.trim()
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim()
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim()
    }
    
    try {
      const result = JSON.parse(jsonStr)
      return Response.json({ roles: result.roles || [] })
    } catch (parseError) {
      console.error('Failed to parse AI response:', response)
      throw new Error('Invalid AI response format')
    }

  } catch (error: any) {
    console.error('Role generation error:', error)
    return Response.json({ roles: [], error: error.message }, { status: 200 })
  }
}
