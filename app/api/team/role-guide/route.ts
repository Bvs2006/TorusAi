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

CRITICAL BEST PRACTICES TO FOLLOW:
1. Provide Context First: Always explain the goal, architecture, and tech stack.
2. Break Down Tasks: Keep developers focused on one clear objective per phase.
3. Define the "Definition of Done" (DoD): Clearly state acceptance criteria, edge cases, and testing requirements in the description.
4. High-Fidelity Prompts: Be specific, provide code context, and specify constraints in the AI prompt.
5. Standardize Workflows: Include guidelines on code style, error handling, and version control.

The workflow must follow this logical flow (7 Distinct Phases):
1. Setup and dependencies.
2. Core backend logic and data models.
3. UI components and state management.
4. Integration and testing.
5. Edge Cases & Error Handling.
6. Testing & Polish.
7. Deployment.

Output exactly this structured JSON format. Output ONLY valid JSON:
{
  "responsibilities": ["List of 3 main responsibilities for this role"],
  "tools": ["E.g., VS Code, Vercel, Postman, Cursor"],
  "workflow": [
    {
      "step_number": 1,
      "title": "Short title of step (e.g. Phase 1: Setup)",
      "description": "What they should do, including the Goal/Definition of Done.",
      "ai_prompt": "A high-fidelity prompt they can use with an AI tool to accomplish this step"
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
