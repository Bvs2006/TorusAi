// app/api/ai/validate-feature/route.ts
import { askGroq } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { featureName, featureDescription, projectIdea, platform, stack } = await req.json()

    const prompt = `You are a product architect evaluating if a feature is suitable for a project.

Project Idea: "${projectIdea}"
Platform: ${platform}
Tech Stack: ${JSON.stringify(stack)}

Feature to validate:
Name: "${featureName}"
Description: "${featureDescription}"

Analyze if this feature is SUITABLE for the project idea. Consider:
1. Does it align with the core project purpose?
2. Is it technically feasible with the given stack?
3. Does it add value or is it out-of-scope?
4. Any potential conflicts with the project goal?

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "suitable": true/false,
  "suitabilityScore": 0-100,
  "reason": "brief explanation why it is or isn't suitable",
  "suggestion": "if not suitable, suggest how to modify it; if suitable, leave empty"
}

Example output:
{"suitable": true, "suitabilityScore": 95, "reason": "Core feature needed for user management", "suggestion": ""}
{"suitable": false, "suitabilityScore": 30, "reason": "Out of scope for current project", "suggestion": "This belongs in phase 2 after MVP"}

RESPOND ONLY WITH JSON:`

    const response = await askGroq(prompt, 1000)
    
    // Parse JSON from response
    let jsonStr = response.trim()
    // Handle markdown code blocks if present
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim()
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim()
    }
    
    const result = JSON.parse(jsonStr)
    
    return Response.json({
      suitable: result.suitable,
      suitabilityScore: result.suitabilityScore,
      reason: result.reason,
      suggestion: result.suggestion
    })
  } catch (error: any) {
    console.error('Validation error:', error)
    return Response.json({ 
      error: error.message,
      suitable: true, // Default to suitable if validation fails
      suitabilityScore: 0,
      reason: 'Could not validate feature',
      suggestion: ''
    }, { status: 200 })
  }
}
