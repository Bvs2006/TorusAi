import { askGroq } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { projectIdea, role, stack } = await req.json()

    const prompt = `You are a world-class CTO and AI Architect. Create an extremely detailed, 7-step "Development Master Guide" for a "${role}" developer building the following project.

Project Idea: "${projectIdea}"
Assigned Stack: ${JSON.stringify(stack)}

CRITICAL BEST PRACTICES TO FOLLOW:
1. Provide Context First: Always explain the goal, architecture, and tech stack.
2. Break Down Tasks: Keep developers focused on one clear objective per phase.
3. Define the "Definition of Done" (DoD): Clearly state acceptance criteria, edge cases, and testing requirements.
4. High-Fidelity Prompts: Be specific, provide code context, and specify constraints in the Master Prompt.
5. Standardize Workflows: Include guidelines on code style, error handling, and version control where applicable.

The guide must follow this exact logical flow (7 Distinct Phases):
1. Phase 1: Setup and dependencies (IDE & Environment).
2. Phase 2: Core backend logic and data models.
3. Phase 3: UI components and state management.
4. Phase 4: Integration and testing.
5. Phase 5: Edge Cases & Error Handling (Resiliency, loading states).
6. Phase 6: Testing & Polish (Responsive design, user flows).
7. Phase 7: Deployment (Final Ship).

For each step in the roadmap, provide:
1. Title: Concise name (e.g., "Phase 1: Setup and dependencies").
2. Context: A detailed explanation of the Goal, Architecture, and "Why" we are doing this.
3. Description: Detailed technical instructions on how to execute.
4. AI Tool: The best tool for this step (e.g., "Cursor", "Windsurf", "v0.dev").
5. Tool Usage: A short guide on how to use the recommended tool.
6. Sub-Steps: 3-4 granular, verifiable technical tasks.
7. Master Prompt: A high-fidelity prompt to paste into an AI IDE. Must be specific, mention constraints, and define styles.
8. IDE Integration: Steps to integrate generated code.
9. Goal: The exact "Definition of Done" (DoD) - how to verify completion.

Requirements:
- Tailor everything to the "${role}" role.
- Pro-level prompts only.
- Direct and actionable instructions.

Format your response as ONLY valid JSON:
{
  "roadmap": [
    {
      "title": "...",
      "context": "...",
      "description": "...",
      "tool": "...",
      "usage": "...",
      "subSteps": ["...", "...", "..."],
      "prompt": "...",
      "integration": "...",
      "goal": "..."
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
