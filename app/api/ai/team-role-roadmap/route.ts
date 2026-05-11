import { askGroq } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { projectName, projectIdea, platform, features, architectureTools, role, stack } = await req.json()
    const featureSummary = Array.isArray(features) && features.length
      ? features.map((feature: any, index: number) => {
          const description = feature.description ? ` - ${feature.description}` : ''
          const metadata = [feature.priority, feature.complexity].filter(Boolean).join(', ')
          return `${index + 1}. ${feature.name}${description}${metadata ? ` (${metadata})` : ''}`
        }).join('\n')
      : 'No generated features were provided.'

    const roleLower = String(role || '').toLowerCase()
    const isLeaderRole = roleLower.includes('lead') || roleLower.includes('leader') || roleLower.includes('manager') || roleLower.includes('cto')
    const architectureToolSummary = Array.isArray(architectureTools) && architectureTools.length
      ? architectureTools.slice(0, 10).map((tool: any, index: number) => {
          const layer = tool.layer || tool.category || 'General'
          const reason = tool.reason ? ` - ${tool.reason}` : ''
          const configuration = tool.configuration ? ` Setup: ${tool.configuration}` : ''
          return `${index + 1}. ${tool.name} (${layer})${reason}${configuration}`
        }).join('\n')
      : 'No architecture AI tool recommendations were provided. Use the stack and project features to select tools.'

    const prompt = `You are a world-class CTO and AI Architect. Create an extremely detailed, 7-step "Development Master Guide" for a "${role}" developer building the following project.

Project Name: "${projectName || 'Untitled project'}"
Project Idea: "${projectIdea}"
Target Platform: ${platform || 'Not specified'}
Assigned Stack: ${JSON.stringify(stack)}
Generated Features:
${featureSummary}
Architecture AI Tools:
${architectureToolSummary}

Role Mode:
${isLeaderRole
  ? '- This is a team leader / lead developer guide. Focus on ownership, planning, architecture decisions, task assignment, integration checkpoints, code review, risk tracking, demo preparation, and unblocking teammates. Include coding tasks only when the lead must build shared foundations.'
  : '- This is an individual contributor guide. Focus on the exact implementation ownership for this role and how it coordinates with the team leader.'}

CRITICAL BEST PRACTICES TO FOLLOW:
1. Provide Context First: Always explain the goal, architecture, and tech stack.
2. Break Down Tasks: Keep developers focused on one clear objective per phase.
3. Define the "Definition of Done" (DoD): Clearly state acceptance criteria, edge cases, and testing requirements.
4. High-Fidelity Prompts: Be specific, provide code context, and specify constraints in the Master Prompt.
5. Standardize Workflows: Include guidelines on code style, error handling, and version control where applicable.
6. Avoid generic SaaS boilerplate. Every phase must mention the actual project idea, at least one generated feature, and the selected stack where relevant.
7. Use the Architecture AI Tools list when choosing the recommended tool for each phase. Prefer tools from the matching layer instead of generic defaults.

The guide must follow this exact logical flow (7 Distinct Phases):
1. Phase 1: Project understanding, role ownership, setup, and dependencies.
2. Phase 2: Data model, API contract, or coordination plan for the role's owned features.
3. Phase 3: UI, backend, AI, or workflow implementation tasks based on the role.
4. Phase 4: Integration with other roles and end-to-end feature wiring.
5. Phase 5: Edge cases, error handling, permissions, and resiliency.
6. Phase 6: Testing, review, polish, and demo readiness.
7. Phase 7: Deployment handoff and final submission checklist.

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
- If the role is a leader, include team coordination rituals, task allocation, daily review points, merge strategy, and final presentation responsibilities.
- If the role is not a leader, include what this person must report to the team leader after each phase.
- Use the provided generated features. Do not invent unrelated product features.
- Use the provided Architecture AI Tools and their configuration notes when assigning tools and writing tool usage instructions.
- The Master Prompt for each step must include project name, project idea, role, target features, stack constraints, expected files/artifacts, and definition of done.
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
