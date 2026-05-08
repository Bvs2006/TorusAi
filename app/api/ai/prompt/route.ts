// app/api/ai/prompt/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { askGroq } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { phase, tool, stack, projectIdea, features, experience } = await req.json()

    if (!phase || !tool) {
      return NextResponse.json({ error: 'Phase and tool required' }, { status: 400 })
    }

    const techContext = stack ? `
Tech Stack Being Used:
- Frontend: ${stack.frontend?.name}
- Backend: ${stack.backend?.name}  
- Database: ${stack.database?.name}
- Auth: ${stack.auth?.name}
- AI: ${stack.ai?.name}
- Deployment: ${stack.deployment?.name}` : ''

    const prompt = `You are Torus AI. Write a specific, detailed prompt for a developer to use in ${tool}.

Project: "${projectIdea}"
Current Phase: ${phase.name} (Phase ${phase.phase_number}/7)
Developer Experience: ${experience || 'intermediate'}
Features to build: ${features?.join(', ') || 'core features'}
${techContext}

Write an EXACT prompt they can copy and paste into ${tool}. The prompt must:
1. Be specific to THIS project, not generic
2. Reference the actual technologies from the stack
3. Include concrete file names, function names, and implementation details
4. Be comprehensive enough to complete this entire phase
5. Include error handling requirements
6. Specify TypeScript types needed

Write ONLY the prompt text, no introduction or explanation. Start directly with the action.`

    const generatedPrompt = await askGroq(prompt, 800)

    // Generate follow-up tips
    const tipsPrompt = `Give 3 SHORT tips for what to do after completing "${phase.name}" with ${tool} for a ${projectIdea} project. 
Format as JSON array: ["tip 1", "tip 2", "tip 3"]
Keep each tip under 15 words.`

    const tipsRaw = await askGroq(tipsPrompt, 200)
    let tips: string[] = []
    try {
      tips = JSON.parse(tipsRaw.replace(/```json\n?/g, '').replace(/```/g, '').trim())
    } catch {
      tips = ['Test the feature end-to-end', 'Commit your changes to Git', 'Move on to the next phase']
    }

    return NextResponse.json({ prompt: generatedPrompt, tips })

  } catch (error: any) {
    console.error('Prompt API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
