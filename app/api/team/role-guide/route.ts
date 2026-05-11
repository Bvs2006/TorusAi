import { NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/ai-router'

export async function POST(req: Request) {
  try {
    const { idea, stack, role, platform, features } = await req.json()

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    const roleLower = String(role || '').toLowerCase()
    const isLeaderRole = roleLower.includes('lead') || roleLower.includes('leader') || roleLower.includes('manager') || roleLower.includes('cto')
    const featureSummary = Array.isArray(features) && features.length
      ? features.map((feature: any) => typeof feature === 'string' ? feature : `${feature.name || feature.title}: ${feature.description || ''}`).join('\n')
      : 'No feature list provided. Infer only from the project idea.'

    const systemPrompt = `You are an expert Engineering Manager.
Create a step-by-step development guide for a specific team member role to execute their part of the project.

CRITICAL BEST PRACTICES TO FOLLOW:
1. Provide Context First: Always explain the goal, architecture, and tech stack.
2. Break Down Tasks: Keep developers focused on one clear objective per phase.
3. Define the "Definition of Done" (DoD): Clearly state acceptance criteria, edge cases, and testing requirements in the description.
4. High-Fidelity Prompts: Be specific, provide code context, and specify constraints in the AI prompt.
5. Standardize Workflows: Include guidelines on code style, error handling, and version control.
6. Project Specificity: Every responsibility, workflow step, and AI prompt must mention the actual project idea, selected stack, and relevant features. Do not return generic full-stack instructions.

ROLE MODE:
${isLeaderRole
  ? 'This is a Team Leader / Lead Developer guide. Focus on planning, architecture ownership, task assignment, integration, code review, blockers, merge strategy, QA coordination, and demo/submission readiness.'
  : 'This is an individual contributor guide. Focus on implementation ownership and what this role reports to the team leader after each phase.'}

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

    const userPrompt = `Project: ${idea}
Platform: ${platform || 'Not specified'}
Tech Stack: ${JSON.stringify(stack)}
Features:
${featureSummary}
Role: ${role}
Generate a project-specific guide.`

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
