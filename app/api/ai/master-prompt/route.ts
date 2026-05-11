import { NextResponse } from 'next/server'
import { generateAIResponse, AIProvider } from '@/lib/ai-router'

type MasterPromptResponse = {
  questions: string[]
  improvedPrompt: string
  sections: string[]
  tips: string[]
}

const cleanJson = (content: string) => {
  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenced?.[1]) return fenced[1]
  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1)
  return trimmed
}

const fallbackPrompt = (idea: string, category: string, targetModel: string, answers: string): MasterPromptResponse => ({
  questions: [
    'Who is the target audience or end user?',
    'What exact output format do you want the AI to return?',
    'Are there tools, tech stack, brand, tone, or platform constraints?',
    'What should the AI avoid doing?'
  ],
  sections: ['Context', 'Role', 'Task', 'Requirements', 'Constraints', 'Output format', 'Quality bar'],
  tips: [
    'Add real examples or sample data when possible.',
    'Tell the AI what success looks like before asking for the final answer.',
    'Mention the model or tool you plan to use when it changes the expected format.'
  ],
  improvedPrompt: `Act as a senior prompt engineer and ${category.toLowerCase()} specialist.

Context:
I want to turn this idea into a high-quality result using ${targetModel}: ${idea.trim()}

Additional details:
${answers.trim() || 'Use sensible assumptions where details are missing, and clearly state those assumptions before the final output.'}

Task:
Transform the idea into a complete, actionable response. Break the work into clear steps, include the necessary context, and make the final result ready to use.

Requirements:
- Ask only the most important clarification questions if information is missing.
- Use structured headings and concise bullets.
- Include practical examples, edge cases, and implementation details when relevant.
- Optimize the response for ${targetModel} and keep it specific to the ${category} use case.

Constraints:
- Do not give generic advice.
- Do not skip assumptions, risks, or missing information.
- Do not invent facts that should be verified.

Output format:
1. Assumptions
2. Clarifying questions
3. Step-by-step plan
4. Final copy-ready output
5. Checklist for quality`
})

export async function POST(req: Request) {
  try {
    const { idea, category = 'General', targetModel = 'ChatGPT', answers = '', provider } = await req.json()

    if (!idea || typeof idea !== 'string' || !idea.trim()) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    const systemPrompt = `You are Master Prompt, an expert AI prompt optimization engine.
You transform rough user ideas into detailed prompts for ChatGPT, Claude, Gemini, and other LLMs.
Return ONLY valid JSON with this exact shape:
{
  "questions": ["3 to 5 short follow-up questions"],
  "sections": ["5 to 7 section labels used in the improved prompt"],
  "tips": ["3 short practical prompt quality tips"],
  "improvedPrompt": "A detailed, copy-ready prompt using clear headings."
}
Rules:
- Make the prompt specific to the selected category and target model.
- Include context, role, task, constraints, objectives, output format, quality checks, and what to avoid.
- If the user provided answers, merge them into the prompt.
- Do not include markdown fences around the JSON.`

    const userPrompt = `User idea: ${idea}
Category: ${category}
Target model: ${targetModel}
Follow-up answers: ${answers || 'None yet'}`

    let result
    try {
      result = await generateAIResponse(systemPrompt, userPrompt, provider as AIProvider)
    } catch (aiError) {
      console.error('Master Prompt provider fallback:', aiError)
      return NextResponse.json({
        ...fallbackPrompt(idea, category, targetModel, answers),
        ai_provider: 'local',
        ai_model: 'structured-fallback'
      })
    }

    let parsed: MasterPromptResponse

    try {
      parsed = JSON.parse(cleanJson(result.content))
    } catch {
      parsed = fallbackPrompt(idea, category, targetModel, answers)
    }

    return NextResponse.json({
      questions: Array.isArray(parsed.questions) ? parsed.questions.slice(0, 5) : [],
      sections: Array.isArray(parsed.sections) ? parsed.sections.slice(0, 7) : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 4) : [],
      improvedPrompt: parsed.improvedPrompt || fallbackPrompt(idea, category, targetModel, answers).improvedPrompt,
      ai_provider: result.provider,
      ai_model: result.model
    })
  } catch (error: any) {
    console.error('Master Prompt API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to improve prompt' }, { status: 500 })
  }
}
