import { askGroq } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { projectIdea, role, stack } = await req.json()

    const prompt = `You are a senior technical lead. Create a highly specific, 5-step implementation roadmap for a "${role}" developer.

Project Idea: "${projectIdea}"
Assigned Stack: ${JSON.stringify(stack)}

For each step in the roadmap, provide:
1. Title: A concise name for the phase (e.g., "Schema Design", "UI Component Library").
2. Description: A clear explanation of what the developer needs to build in this step.
3. Goal: The expected outcome or definition of done for this step.
4. AI Prompt: A detailed, context-aware prompt that the developer can paste into an AI coding assistant (like Cursor, v0, or ChatGPT) to generate the code/infrastructure for this specific step.

Requirements:
- The roadmap must be tailored specifically to the responsibilities of a "${role}".
- Prompts should be professional and include best practices for the given stack.

Format your response as ONLY valid JSON (no preamble, no markdown):
{
  "roadmap": [
    {
      "title": "Step 1: ...",
      "description": "...",
      "goal": "...",
      "prompt": "..."
    }
  ]
}

RESPOND ONLY WITH JSON:`

    const response = await askGroq(prompt, 3000)
    
    let jsonStr = response.trim()
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim()
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim()
    }
    
    try {
      const result = JSON.parse(jsonStr)
      return Response.json({ roadmap: result.roadmap || [] })
    } catch (parseError) {
      console.error('Failed to parse Roadmap AI response:', response)
      throw new Error('Invalid AI response format')
    }

  } catch (error: any) {
    console.error('Roadmap generation error:', error)
    return Response.json({ roadmap: [], error: error.message }, { status: 200 })
  }
}
