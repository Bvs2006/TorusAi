import { NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/ai-router'

export async function POST(req: Request) {
  try {
    const { idea, stack, role } = await req.json()

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    const systemPrompt = `You are an expert Engineering Manager.
Create a step-by-step development guide for a specific team member role to execute their part of the project.
Output exactly this structured JSON format. Output ONLY valid JSON:
{
  "responsibilities": ["List of 3 main responsibilities for this role"],
  "tools": ["E.g., VS Code, Vercel, Postman, Cursor"],
  "workflow": [
    {
      "step_number": 1,
      "title": "Short title of step",
      "description": "What they should do",
      "ai_prompt": "An exact prompt they can use with an AI tool to accomplish this step"
    }
  ],
  "common_mistakes": ["Mistake 1", "Mistake 2"]
}
Ensure output is ONLY parseable JSON.`

    const userPrompt = `Project: ${idea}\nTech Stack: ${JSON.stringify(stack)}\nRole: ${role}\nGenerate the guide.`

    const result = await generateAIResponse(systemPrompt, userPrompt)

    // Clean up response if it contains markdown code blocks
    let cleanedContent = result.content
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanedContent = jsonMatch[0]
    }

    const parsed = JSON.parse(cleanedContent)
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Role Guide Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate guide' }, { status: 500 })
  }
}
