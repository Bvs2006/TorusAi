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

    const prompt = `You are Torus AI, an elite Principal Software Engineer and AI Architect. Your objective is to write the ultimate, most comprehensive, high-fidelity AI prompt that a human developer will copy and paste directly into their AI IDE (${tool}, like Cursor or Windsurf) to execute the current phase of their project.

The prompt you generate must act as a Senior Engineering Manager guiding an AI coding assistant. It needs to be extremely lengthy, specific, and structured.

=== PROJECT CONTEXT ===
Project Idea: "${projectIdea}"
Current Phase: ${phase.name} (Phase ${phase.phase_number} out of 7)
Developer Experience Level: ${experience || 'intermediate'}
Target Features: ${features?.join(', ') || 'core features'}
${techContext}

=== THE 5 PILLARS OF YOUR GENERATED PROMPT ===
You MUST structure the generated prompt strictly using the following 5 pillars (Best Practices for Guiding Developers):

1. CONTEXT FIRST (The "Why" and "Where"):
   - Start the prompt by explicitly stating the overall goal of the project and the specific goal of this phase.
   - Explain the architecture: where does this feature fit within the existing system?
   - Reiterate the tech stack and explicitly declare the frameworks, libraries, and design systems to be used.

2. BREAK DOWN TASKS (The "How"):
   - Instruct the AI IDE to NEVER write monolithic code. It must break down this phase into 3-5 hyper-specific, sequential implementation steps.
   - Command the AI to pause and verify after each step before moving to the next.

3. DEFINITION OF DONE (DoD) & ACCEPTANCE CRITERIA:
   - Provide an exact checklist of what constitutes "Done" for this phase.
   - Specify required edge-case handling (e.g., API failures, empty states, loading skeletons).
   - Specify UI/UX requirements (e.g., mobile responsiveness, accessibility, theme variables).

4. HIGH-FIDELITY TECHNICAL CONSTRAINTS:
   - Command the AI IDE to use specific file paths and naming conventions.
   - Provide explicit code context constraints (e.g., "Use Next.js 14 App Router, server components by default, client components only when using hooks").
   - Ban the use of deprecated libraries or external CSS libraries if Tailwind is specified.

5. STANDARDIZED WORKFLOWS & STYLE GUIDELINES:
   - Enforce strict typing (e.g., "Use strict TypeScript interfaces for all data models, no 'any' types").
   - Specify exact error handling patterns (e.g., "Wrap all async calls in try/catch blocks and use a standard error toast notification").
   - Enforce modular, reusable component design.

=== FORMATTING RULES FOR YOUR OUTPUT ===
- DO NOT wrap your response in introductory text. Start directly with the prompt content.
- Use markdown formatting, clear headings, and bullet points to make the generated prompt highly readable.
- The prompt you write must be written from the perspective of the developer speaking to the AI IDE. (e.g., "You are an expert AI assistant. Your task is to build... Follow these strict constraints...")
- Make it LENGTHY and EXHAUSTIVE. A prompt that is too short will fail. Provide extreme detail.
- Ensure the prompt is perfectly optimized for ${tool}.`

    const generatedPrompt = await askGroq(prompt, 2500)

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
