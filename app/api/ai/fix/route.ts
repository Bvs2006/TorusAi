// app/api/ai/fix/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { askGroq, parseJSON } from '@/lib/groq'
import type { AIFixResponse } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { error, language, context, stack } = await req.json()

    if (!error) {
      return NextResponse.json({ error: 'Error message required' }, { status: 400 })
    }

    const stackInfo = stack ? `\nProject stack: ${Object.values(stack).map((s: any) => s.name).join(', ')}` : ''

    const prompt = `You are a senior developer. Analyze this error and provide a complete fix.

Language/Framework: ${language || 'TypeScript/React'}
Error message:
${error}

Context (what the developer was trying to do): ${context || 'Not specified'}
${stackInfo}

Respond with ONLY valid JSON (no markdown):
{
  "explanation": "Plain English explanation of what went wrong and WHY (2-3 sentences)",
  "steps": [
    "Step 1: Specific actionable fix",
    "Step 2: What to check next",
    "Step 3: How to prevent this",
    "Step 4: Test that it works"
  ],
  "fixedPrompt": "Exact prompt to paste into Cursor/Windsurf: explain the error and exactly how to fix it with specific code changes needed",
  "relatedDocs": "URL to relevant documentation if applicable"
}`

    const raw = await askGroq(prompt, 700)
    const fix = parseJSON<AIFixResponse>(raw)

    if (!fix) {
      // Return a structured fallback even if parsing fails
      return NextResponse.json({
        explanation: 'An error occurred while analyzing your error. The raw response is included.',
        steps: ['Check the error message carefully', 'Search for the error online', 'Check your recent code changes'],
        fixedPrompt: `Please fix this error in my code:\n${error}\n\nContext: ${context}`,
        raw
      })
    }

    return NextResponse.json(fix)

  } catch (error: any) {
    console.error('Fix API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
